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
        Schema::create('document_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // 'transcript', 'certificate', 'report_card', etc.
            $table->text('description')->nullable();
            $table->text('template_content'); // HTML template with placeholders
            $table->json('placeholders'); // Available placeholders like {{student_name}}, {{gpa}}, etc.
            $table->json('settings')->nullable(); // Watermark, header, footer, etc.
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_templates');
    }
};
