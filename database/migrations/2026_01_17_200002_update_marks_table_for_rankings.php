<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            $table->foreignId('assessment_type_id')->nullable()->constrained()->onDelete('set null');
            $table->integer('weight_percentage')->nullable();
            $table->boolean('is_published')->default(false);
            $table->integer('rank_position')->nullable();
            $table->decimal('class_average', 5, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('marks', function (Blueprint $table) {
            $table->dropForeign(['assessment_type_id']);
            $table->dropColumn([
                'assessment_type_id',
                'weight_percentage',
                'is_published',
                'rank_position',
                'class_average'
            ]);
        });
    }
};
