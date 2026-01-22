<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('academic_years', function (Blueprint $table) {
            $table->boolean('is_current')->default(false)->after('status');
        });

        // Set the most recent academic year as current
        DB::statement("UPDATE academic_years SET is_current = 1 WHERE id = (SELECT id FROM academic_years ORDER BY created_at DESC LIMIT 1)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('academic_years', function (Blueprint $table) {
            $table->dropColumn('is_current');
        });
    }
};
