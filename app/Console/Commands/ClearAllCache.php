<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class ClearAllCache extends Command
{
    protected $signature = 'cache:clear-all';
    protected $description = 'Clear all application caches (route, config, view, cache)';

    public function handle()
    {
        $this->info('Clearing all caches...');

        // Clear application cache
        Cache::flush();
        $this->info('✓ Application cache cleared');

        // Clear route cache
        Artisan::call('route:clear');
        $this->info('✓ Route cache cleared');

        // Clear config cache
        Artisan::call('config:clear');
        $this->info('✓ Config cache cleared');

        // Clear view cache
        Artisan::call('view:clear');
        $this->info('✓ View cache cleared');

        // Clear compiled classes
        Artisan::call('clear-compiled');
        $this->info('✓ Compiled classes cleared');

        $this->info('');
        $this->info('All caches cleared successfully!');
        
        return 0;
    }
}
