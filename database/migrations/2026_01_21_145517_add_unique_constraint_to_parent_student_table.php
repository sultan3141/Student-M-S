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
            // Add unique constraint to ensure one student can only be linked to one parent
            $table->unique('student_id', 'unique_student_parent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parent_student', function (Blueprint $table) {
            $table->dropUnique('unique_student_parent');
        });
    }
};