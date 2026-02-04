<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AcademicYear;

class SetCurrentAcademicYearSeeder extends Seeder
{
    public function run(): void
    {
        $academicYear = AcademicYear::first();
        
        if ($academicYear) {
            $academicYear->is_current = true;
            $academicYear->save();
            
            $this->command->info('✅ Academic Year "' . $academicYear->name . '" set as current');
        } else {
            $this->command->error('❌ No academic year found in database');
        }
    }
}
