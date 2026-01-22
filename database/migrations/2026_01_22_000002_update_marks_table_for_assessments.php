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
            // Drop old columns that are now handled by assessments
            $table->dropColumn(['subject_id', 'academic_year_id', 'semester', 'assessment_type']);
            
            // Add assessment reference
            $table->foreignId('assessment_id')->after('student_id')->constrained()->cascadeOnDelete();
            
            // Add remarks field
            $table->text('remarks')->nullable()->after('score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            $table->dropForeign(['assessment_id']);
            $table->dropColumn(['assessment_id', 'remarks']);
            
            // Restore old columns
            $table->foreignId('subject_id')->constrained();
            $table->foreignId('academic_year_id')->constrained();
            $table->enum('semester', ['1', '2']);
            $table->enum('assessment_type', ['Midterm', 'Test', 'Assignment', 'Final']);
        });
    }
};