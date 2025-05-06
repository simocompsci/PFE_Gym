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
        // First, drop the foreign key constraint
        Schema::table('class_sessions', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
        });

        // Then, add the new foreign key constraint
        Schema::table('class_sessions', function (Blueprint $table) {
            $table->foreign('class_id')->references('id')->on('gymclasses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, drop the new foreign key constraint
        Schema::table('class_sessions', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
        });

        // Then, add back the original foreign key constraint
        Schema::table('class_sessions', function (Blueprint $table) {
            $table->foreign('class_id')->references('id')->on('classes')->onDelete('cascade');
        });
    }
};
