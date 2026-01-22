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
        Schema::create('academic_years', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., "2025-2026"
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'inactive', 'planned'])->default('planned');
            $table->boolean('is_current')->default(false);
            $table->timestamps();
        });

        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., "Grade 9"
            $table->integer('level'); // 9, 10, 11, 12
            $table->timestamps();
        });

        Schema::create('streams', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Natural Science, Social Science
            $table->timestamps();
        });

        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // A, B
            $table->foreignId('grade_id')->constrained()->cascadeOnDelete();
            $table->enum('gender', ['Male', 'Female', 'Mixed'])->default('Mixed');
            $table->integer('capacity')->default(50);
            $table->foreignId('stream_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->foreignId('grade_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
        Schema::dropIfExists('sections');
        Schema::dropIfExists('streams');
        Schema::dropIfExists('grades');
        Schema::dropIfExists('academic_years');
    }
};
