<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('assessment_types', function (Blueprint $table) {
            // Add foreign key columns
            $table->foreignId('grade_id')->nullable()->after('name')->constrained('grades')->onDelete('cascade');
            $table->foreignId('section_id')->nullable()->after('grade_id')->constrained('sections')->onDelete('cascade');
            $table->foreignId('subject_id')->nullable()->after('section_id')->constrained('subjects')->onDelete('cascade');
            
            // Add weight column (rename weight_percentage to weight for consistency)
            $table->decimal('weight', 5, 2)->nullable()->after('subject_id');
        });
    }

    public function down(): void
    {
        Schema::table('assessment_types', function (Blueprint $table) {
            $table->dropForeign(['grade_id']);
            $table->dropForeign(['section_id']);
            $table->dropForeign(['subject_id']);
            $table->dropColumn(['grade_id', 'section_id', 'subject_id', 'weight']);
        });
    }
};
