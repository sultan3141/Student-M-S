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
        Schema::table('teachers', function (Blueprint $table) {
            if (!Schema::hasColumn('teachers', 'user_id')) {
                $table->foreignId('user_id')->after('id')->nullable()->constrained()->cascadeOnDelete();
            }
            if (!Schema::hasColumn('teachers', 'photo')) {
                $table->string('photo')->nullable();
            }
            if (!Schema::hasColumn('teachers', 'phone')) {
                $table->string('phone')->nullable();
            }
            if (!Schema::hasColumn('teachers', 'address')) {
                $table->text('address')->nullable();
            }
            if (!Schema::hasColumn('teachers', 'bio')) {
                $table->text('bio')->nullable();
            }
            if (!Schema::hasColumn('teachers', 'department')) {
                $table->string('department')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn(['user_id', 'photo', 'phone', 'address', 'bio', 'department']);
        });
    }
};
