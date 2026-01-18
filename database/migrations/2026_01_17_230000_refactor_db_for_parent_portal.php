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
            $table->string('name')->unique();
        });

        Schema::create('parent_student', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('parents')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->timestamps();
        });

        // Modify marks table to use assessment_type_id
        // We drop the enum column and add the foreign key
        Schema::table('marks', function (Blueprint $table) {
            $table->dropColumn('assessment_type');
            $table->foreignId('assessment_type_id')->nullable()->constrained('assessment_types'); 
            $table->text('comment')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            $table->dropForeign(['assessment_type_id']);
            $table->dropColumn('assessment_type_id');
            $table->enum('assessment_type', ['Midterm', 'Test', 'Assignment', 'Final']);
        });

        Schema::dropIfExists('parent_student');
        Schema::dropIfExists('assessment_types');
    }
};
