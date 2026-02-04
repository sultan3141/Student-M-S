<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;

class CleanupDuplicateSubjectsSeeder extends Seeder
{
    /**
     * Remove duplicate subjects created by ParentPortalSeeder.
     * These subjects have codes like MTH101, PHY101, etc.
     */
    public function run(): void
    {
        $duplicateCodes = [
            'MTH101',
            'PHY101', 
            'CHM101',
            'BIO101',
            'ENG101',
            'AMH101',
            'CIV101'
        ];

        $deleted = Subject::whereIn('code', $duplicateCodes)->delete();

        $this->command->info("✅ Removed {$deleted} duplicate subject(s)");
    }
}
