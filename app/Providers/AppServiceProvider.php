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
        // Fix PostgreSQL boolean binding issue
        if (config('database.default') === 'pgsql') {
            \Illuminate\Database\Query\Grammars\PostgresGrammar::macro('getBindingValue', function ($value) {
                if (is_bool($value)) {
                    return $value ? 'true' : 'false';
                }
                return $value;
            });
        }
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
