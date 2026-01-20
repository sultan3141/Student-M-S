<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FixAcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        // Set is_current to TRUE for the active academic year
        DB::statement("UPDATE academic_years SET is_current = TRUE WHERE status = 'active'");
        
        $this->command->info('✅ Fixed academic year is_current field');
    }
}
