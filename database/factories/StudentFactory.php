<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'student_id' => fake()->unique()->numerify('STU####'),
            'dob' => fake()->date(),
            'gender' => fake()->randomElement(['Male', 'Female']),
            // 'grade_id' => \App\Models\Grade::factory(), // Can allow null or factories if needed
            // 'section_id' => \App\Models\Section::factory(),
            // 'stream_id' => \App\Models\Stream::factory(),
        ];
    }
}
