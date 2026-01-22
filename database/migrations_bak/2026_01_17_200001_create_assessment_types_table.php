<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessment_types', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // 'Midterm', 'Final', 'Test', 'Assignment'
            $table->integer('weight_percentage'); // 30, 40, etc.
            $table->string('subject')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Seed default assessment types
        DB::table('assessment_types')->insert([
            ['name' => 'Midterm Exam', 'weight_percentage' => 30, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Final Exam', 'weight_percentage' => 40, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Test', 'weight_percentage' => 15, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Assignment', 'weight_percentage' => 10, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Quiz', 'weight_percentage' => 5, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('assessment_types');
    }
};
