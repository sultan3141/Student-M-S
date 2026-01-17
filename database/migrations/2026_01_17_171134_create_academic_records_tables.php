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
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('grade_id')->constrained();
            $table->foreignId('section_id')->constrained();
            $table->foreignId('academic_year_id')->constrained();
            $table->enum('status', ['Enrolled', 'Completed', 'Dropped'])->default('Enrolled');
            $table->timestamps();
        });

        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained();
            $table->foreignId('academic_year_id')->constrained();
            $table->enum('semester', ['1', '2']);
            $table->enum('assessment_type', ['Midterm', 'Test', 'Assignment', 'Final']);
            $table->decimal('score', 5, 2);
            $table->timestamps();
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained();
            $table->decimal('amount', 10, 2);
            $table->enum('type', ['Monthly', 'Semester', 'Annual']);
            $table->enum('status', ['Pending', 'Paid', 'Partial'])->default('Pending');
            $table->date('transaction_date')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->text('description')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_records_tables');
    }
};
