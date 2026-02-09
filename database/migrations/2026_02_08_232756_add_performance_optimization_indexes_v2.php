<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('parent_profiles', function (Blueprint $table) {
            if (Schema::hasColumn('parent_profiles', 'user_id')) {
                $table->index('user_id', 'parent_user_idx');
            }
        });

        Schema::table('teacher_assignments', function (Blueprint $table) {
            $table->index(['teacher_id', 'academic_year_id'], 'teach_assign_teacher_year_idx');
            $table->index(['section_id', 'academic_year_id'], 'teach_assign_section_year_idx');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->index(['student_id', 'date'], 'attendances_student_date_idx');
            $table->index(['section_id', 'date'], 'attendances_section_date_idx');
            $table->index(['academic_year_id', 'date'], 'attendances_year_date_idx');
        });

        Schema::table('marks', function (Blueprint $table) {
            $table->index(['teacher_id', 'academic_year_id'], 'marks_teacher_year_idx');
        });

        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'user_id')) {
                $table->index('user_id', 'students_user_idx');
            }
        });

        Schema::table('sections', function (Blueprint $table) {
            if (Schema::hasColumn('sections', 'class_teacher_id')) {
                $table->index('class_teacher_id', 'sections_teacher_idx');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parent_profiles', function (Blueprint $table) {
            $table->dropIndex('parent_user_idx');
        });

        Schema::table('teacher_assignments', function (Blueprint $table) {
            $table->dropIndex('teach_assign_teacher_year_idx');
            $table->dropIndex('teach_assign_section_year_idx');
        });

        Schema::table('attendances', function (Blueprint $table) {
            $table->dropIndex('attendances_student_date_idx');
            $table->dropIndex('attendances_section_date_idx');
            $table->dropIndex('attendances_year_date_idx');
        });

        Schema::table('marks', function (Blueprint $table) {
            $table->dropIndex('marks_teacher_year_idx');
        });

        Schema::table('students', function (Blueprint $table) {
            $table->dropIndex('students_user_idx');
        });

        Schema::table('sections', function (Blueprint $table) {
            $table->dropIndex('sections_teacher_idx');
        });
    }
};
