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
        Schema::create('academic_semester_statuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained()->cascadeOnDelete();
            $table->integer('semester'); // 1 or 2
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->boolean('is_declared')->default(false); // Optional: track if formally declared
            $table->timestamps();

            $table->unique(['academic_year_id', 'grade_id', 'semester'], 'sem_status_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_semester_statuses');
    }
};
