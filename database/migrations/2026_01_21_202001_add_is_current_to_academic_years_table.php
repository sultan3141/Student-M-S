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
            if (!Schema::hasColumn('academic_years', 'is_current')) {
                $table->boolean('is_current')->default(false)->after('status');
            }
        });

        // Set the most recent academic year as current
        $driver = Schema::getConnection()->getDriverName();
        
        if ($driver === 'pgsql') {
            // PostgreSQL-compatible version using WITH clause
            DB::statement("
                WITH latest AS (
                    SELECT id FROM academic_years ORDER BY created_at DESC LIMIT 1
                )
                UPDATE academic_years SET is_current = true 
                WHERE id = (SELECT id FROM latest)
            ");
        } else {
            // SQLite/MySQL/PostgreSQL fallback (using TRUE is safer for PG)
            DB::statement("UPDATE academic_years SET is_current = TRUE WHERE id = (SELECT id FROM academic_years ORDER BY created_at DESC LIMIT 1)");
        }
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
