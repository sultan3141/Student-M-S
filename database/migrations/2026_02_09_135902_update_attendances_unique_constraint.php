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
        Schema::table('attendances', function (Blueprint $table) {
            // Drop old unique constraint (SQLite might require special handling, but Laravel handles it by recreating the table if needed)
            $table->dropUnique(['student_id', 'date']);
            
            // Add new unique constraint including subject_id
            $table->unique(['student_id', 'date', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropUnique(['student_id', 'date', 'subject_id']);
            $table->unique(['student_id', 'date']);
        });
    }
};
