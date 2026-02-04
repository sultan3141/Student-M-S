<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('academic_years', 'status')) {
            Schema::table('academic_years', function (Blueprint $table) {
                $table->enum('status', ['upcoming', 'active', 'completed'])->default('active')->after('is_current');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('academic_years', 'status')) {
            Schema::table('academic_years', function (Blueprint $table) {
                $table->dropColumn('status');
            });
        }
    }
};
