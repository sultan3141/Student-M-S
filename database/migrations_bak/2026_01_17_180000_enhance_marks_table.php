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
        Schema::table('marks', function (Blueprint $table) {
            // Add foreign keys if they don't exist
            if (!Schema::hasColumn('marks', 'teacher_id')) {
                $table->foreignId('teacher_id')->nullable()->constrained('teachers')->nullOnDelete();
            }
            if (!Schema::hasColumn('marks', 'grade_id')) {
                $table->foreignId('grade_id')->nullable()->constrained('grades');
            }
            if (!Schema::hasColumn('marks', 'section_id')) {
                $table->foreignId('section_id')->nullable()->constrained('sections');
            }

            // Submission and locking status
            $table->boolean('is_submitted')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->boolean('is_locked')->default(false);

            // Indexes for performance
            $table->index(['teacher_id', 'created_at']);
            $table->index(['subject_id', 'section_id']);
            
            // Ensure unique marks per student/subject/assessment
            // Using a shorter name for the unique index to avoid length limits
            $table->unique(['student_id', 'subject_id', 'academic_year_id', 'semester', 'assessment_type'], 'marks_student_subject_assessment_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['grade_id']);
            $table->dropForeign(['section_id']);
            
            $table->dropColumn([
                'teacher_id',
                'grade_id',
                'section_id',
                'is_submitted',
                'submitted_at',
                'is_locked'
            ]);
            
            $table->dropIndex('marks_student_subject_assessment_unique');
        });
    }
};
