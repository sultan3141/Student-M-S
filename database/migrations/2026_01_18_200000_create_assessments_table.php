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
        Schema::create('assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('subject_id')->constrained()->onDelete('cascade');
            $table->foreignId('grade_id')->constrained()->onDelete('cascade');
            $table->foreignId('section_id')->constrained()->onDelete('cascade');
            $table->foreignId('academic_year_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('assessment_type_id')->constrained()->onDelete('cascade');
            
            $table->string('name'); // e.g., "Midterm Exam", "Quiz 1"
            $table->decimal('weight_percentage', 5, 2); // e.g., 30.00
            $table->decimal('max_score', 5, 2)->default(100); // Usually 100
            $table->string('semester'); // 1 or 2
            $table->date('due_date')->nullable();
            $table->text('description')->nullable();
            
            $table->enum('status', ['draft', 'published', 'locked'])->default('draft');
            
            $table->timestamps();
            
            // Indexes for common queries
            $table->index(['teacher_id', 'subject_id', 'semester']);
            $table->index(['grade_id', 'section_id', 'semester']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessments');
    }
};
