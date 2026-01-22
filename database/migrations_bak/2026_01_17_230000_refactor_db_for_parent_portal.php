<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Schema::create('assessment_types', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('name')->unique();
        // });

        Schema::create('parent_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('parents')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->timestamps();
        });

        // Modify marks table
        Schema::table('marks', function (Blueprint $table) {
            // Drop old enum if exists
            if (Schema::hasColumn('marks', 'assessment_type')) {
                $table->dropColumn('assessment_type');
            }
            // assessment_type_id is added by 2026_01_17_200002_update_marks_table_for_rankings
            // $table->foreignId('assessment_type_id')->nullable()->constrained('assessment_types'); 
            
            if (!Schema::hasColumn('marks', 'comment')) {
                $table->text('comment')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            // Reverse changes
            // $table->dropForeign(['assessment_type_id']); // Don't drop shared column
            // $table->dropColumn('assessment_type_id');
            
            if (!Schema::hasColumn('marks', 'assessment_type')) {
                 $table->enum('assessment_type', ['Midterm', 'Test', 'Assignment', 'Final'])->nullable();
            }
             if (Schema::hasColumn('marks', 'comment')) {
                 $table->dropColumn('comment');
             }
        });

        Schema::dropIfExists('parent_student');
        // Schema::dropIfExists('assessment_types'); // Don't drop shared table
    }
};
