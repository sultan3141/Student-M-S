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
        Schema::table('parent_student', function (Blueprint $table) {
            // Add unique constraint to ensure one parent-student pair is unique
            // (prevents duplicate links, but allows multiple parents per student)
            $table->unique(['parent_id', 'student_id'], 'unique_parent_student_pair');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parent_student', function (Blueprint $table) {
            $table->dropUnique('unique_parent_student_pair');
        });
    }
};