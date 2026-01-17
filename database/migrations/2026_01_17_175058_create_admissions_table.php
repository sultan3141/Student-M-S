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
        Schema::create('admissions', function (Blueprint $table) {
            $table->id();
            $table->string('student_name');
            $table->string('student_email')->nullable();
            $table->string('parent_name');
            $table->string('parent_email');
            $table->string('parent_phone');
            $table->string('previous_school')->nullable();
            $table->integer('grade_applying_for'); // Just the numeric grade 9-12
            $table->enum('status', ['New', 'Reviewed', 'Accepted', 'Rejected'])->default('New');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admissions');
    }
};
