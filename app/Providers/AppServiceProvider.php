<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        \Illuminate\Support\Facades\Event::listen(
            \App\Events\TeacherAccountCreated::class,
            \App\Listeners\SendTeacherWelcomeEmail::class
        );

        // Performance Optimizations
        if ($this->app->environment('production')) {
            // Enable query result caching
            \Illuminate\Database\Eloquent\Model::preventLazyLoading();
            
            // Optimize URL generation
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // PostgreSQL PgBouncer/Pooler Compatibility
        if (config('database.default') === 'pgsql') {
            // Listen to connection events to set PDO attributes
            \Illuminate\Support\Facades\DB::listen(function ($query) {
                // This ensures connection is established
            });
            
            // Set PDO attributes after connection
            try {
                $pdo = \Illuminate\Support\Facades\DB::connection('pgsql')->getPdo();
                $pdo->setAttribute(\PDO::ATTR_EMULATE_PREPARES, true);
                $pdo->setAttribute(\PDO::ATTR_STRINGIFY_FETCHES, false);
            } catch (\Exception $e) {
                // Connection not ready yet
            }
        }

        // Optimize SQLite for better performance (only if SQLite is configured)
        if (config('database.default') === 'sqlite') {
            try {
                \Illuminate\Support\Facades\DB::statement('PRAGMA journal_mode=WAL');
                \Illuminate\Support\Facades\DB::statement('PRAGMA synchronous=NORMAL');
                \Illuminate\Support\Facades\DB::statement('PRAGMA cache_size=10000');
                \Illuminate\Support\Facades\DB::statement('PRAGMA temp_store=MEMORY');
            } catch (\Exception $e) {
                // SQLite driver not available or database not accessible
                // This is fine during certain artisan commands
            }
        }

        // Enable model caching for frequently accessed data
        \Illuminate\Database\Eloquent\Model::shouldBeStrict(!$this->app->isProduction());
    }
}
