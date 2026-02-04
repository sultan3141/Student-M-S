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
        Schema::table('assessments', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['assessment_type_id']);
            
            // Make the column nullable
            $table->foreignId('assessment_type_id')->nullable()->change();
            
            // Re-add the foreign key constraint
            $table->foreign('assessment_type_id')
                  ->references('id')
                  ->on('assessment_types')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('assessments', function (Blueprint $table) {
            // Drop the foreign key constraint
            $table->dropForeign(['assessment_type_id']);
            
            // Make the column not nullable again
            $table->foreignId('assessment_type_id')->nullable(false)->change();
            
            // Re-add the foreign key constraint with cascade
            $table->foreign('assessment_type_id')
                  ->references('id')
                  ->on('assessment_types')
                  ->onDelete('cascade');
        });
    }
};
