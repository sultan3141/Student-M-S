<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Enforce unique name per grade for COMMON subjects (stream_id is NULL)
        // "Only one 'Mathematics' for Grade 10"
        DB::statement("CREATE UNIQUE INDEX unique_common_subjects ON subjects (name, grade_id) WHERE stream_id IS NULL");

        // 2. Enforce unique name per grade AND stream for STREAM subjects
        // "Only one 'Advanced Physics' for Grade 11 Natural Science"
        DB::statement("CREATE UNIQUE INDEX unique_stream_subjects ON subjects (name, grade_id, stream_id) WHERE stream_id IS NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP INDEX IF EXISTS unique_common_subjects");
        DB::statement("DROP INDEX IF EXISTS unique_stream_subjects");
    }
};
