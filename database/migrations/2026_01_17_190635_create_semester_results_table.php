<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('semester_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained()->cascadeOnDelete();
            $table->integer('semester'); // 1 or 2
            $table->decimal('average', 5, 2)->nullable();
            $table->integer('rank')->nullable();
            $table->text('teacher_remarks')->nullable();
            $table->timestamps();
            
            // Unique constraint for student, year, grade, semester
            $table->unique(['student_id', 'academic_year_id', 'grade_id', 'semester'], 'semester_result_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semester_results');
    }
};
