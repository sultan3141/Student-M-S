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
        Schema::create('final_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained()->cascadeOnDelete();
            $table->decimal('combined_average', 5, 2)->nullable();
            $table->integer('final_rank')->nullable();
            $table->enum('promotion_status', ['passed', 'failed', 'pending'])->default('pending');
            $table->text('teacher_remarks')->nullable();
            $table->timestamps();
            
            // Unique constraint for student, year, grade
            $table->unique(['student_id', 'academic_year_id', 'grade_id'], 'final_result_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('final_results');
    }
};
