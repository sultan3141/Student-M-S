<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rankings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('semester'); // '1' or '2'
            $table->string('academic_year'); // '2024-2025'
            $table->string('subject');
            $table->integer('rank_position');
            $table->decimal('average_score', 5, 2);
            $table->decimal('total_marks', 8, 2);
            $table->decimal('attendance_percentage', 5, 2)->nullable();
            $table->enum('trend', ['up', 'stable', 'down'])->default('stable');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['student_id', 'semester', 'academic_year']);
            $table->index(['subject', 'semester', 'rank_position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rankings');
    }
};
