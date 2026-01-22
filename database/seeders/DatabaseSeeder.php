<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RoleSeeder::class,
            AcademicStructureSeeder::class,
            SubjectSeeder::class,
        ]);

        $admin = User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@ipsms.com',
            'password' => bcrypt('password'),
        ]);

        $admin->assignRole('super_admin');

        // Create School Director
        $director = User::factory()->create([
            'name' => 'School Director',
            'email' => 'director@ipsms.com',
            'password' => bcrypt('password'),
        ]);

        $director->assignRole('school_director');

        // Create a sample teacher
        $teacher = User::factory()->create([
            'name' => 'John Teacher',
            'email' => 'teacher@ipsms.com',
            'password' => bcrypt('password'),
        ]);

        $teacher->assignRole('teacher');
    }
}
