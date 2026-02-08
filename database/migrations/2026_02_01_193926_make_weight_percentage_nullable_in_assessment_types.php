<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        
        if ($driver === 'pgsql') {
            // PostgreSQL supports ALTER COLUMN directly
            DB::statement('ALTER TABLE assessment_types ALTER COLUMN weight_percentage DROP NOT NULL');
        } else {
            // SQLite doesn't support modifying columns directly, so we need to recreate the table
            // First, create a temporary table with the new structure
            Schema::create('assessment_types_temp', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->foreignId('grade_id')->nullable()->constrained('grades')->onDelete('cascade');
                $table->foreignId('section_id')->nullable()->constrained('sections')->onDelete('cascade');
                $table->foreignId('subject_id')->nullable()->constrained('subjects')->onDelete('cascade');
                $table->decimal('weight', 5, 2)->nullable();
                $table->integer('weight_percentage')->nullable(); // Make nullable
                $table->string('subject')->nullable();
                $table->text('description')->nullable();
                $table->timestamps();
            });

            // Copy data from old table to new table
            DB::statement('INSERT INTO assessment_types_temp (id, name, grade_id, section_id, subject_id, weight, weight_percentage, subject, description, created_at, updated_at) 
                           SELECT id, name, grade_id, section_id, subject_id, weight, weight_percentage, subject, description, created_at, updated_at 
                           FROM assessment_types');

            // Drop old table
            Schema::dropIfExists('assessment_types');

            // Rename temp table to original name
            Schema::rename('assessment_types_temp', 'assessment_types');
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        
        if ($driver === 'pgsql') {
            // PostgreSQL supports ALTER COLUMN directly
            DB::statement('ALTER TABLE assessment_types ALTER COLUMN weight_percentage SET NOT NULL');
        } else {
            // Reverse: make weight_percentage NOT NULL again
            Schema::create('assessment_types_temp', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->foreignId('grade_id')->nullable()->constrained('grades')->onDelete('cascade');
                $table->foreignId('section_id')->nullable()->constrained('sections')->onDelete('cascade');
                $table->foreignId('subject_id')->nullable()->constrained('subjects')->onDelete('cascade');
                $table->decimal('weight', 5, 2)->nullable();
                $table->integer('weight_percentage'); // NOT NULL
                $table->string('subject')->nullable();
                $table->text('description')->nullable();
                $table->timestamps();
            });

            DB::statement('INSERT INTO assessment_types_temp (id, name, grade_id, section_id, subject_id, weight, weight_percentage, subject, description, created_at, updated_at) 
                           SELECT id, name, grade_id, section_id, subject_id, weight, COALESCE(weight_percentage, 0), subject, description, created_at, updated_at 
                           FROM assessment_types');

            Schema::dropIfExists('assessment_types');
            Schema::rename('assessment_types_temp', 'assessment_types');
        }
    }
};
