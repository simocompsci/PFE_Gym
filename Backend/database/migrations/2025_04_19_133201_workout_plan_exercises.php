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
        Schema::create('workout_plan_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_plan_id')->constrained('custom_workout_plans')->onDelete('cascade');
            $table->string('exercise_name', 100);
            $table->integer('sets')->nullable();
            $table->string('reps', 50)->nullable()->comment('Can be "8-12" or "AMRAP" etc.');
            $table->integer('rest_seconds')->nullable();
            $table->tinyInteger('day_of_week')->nullable()->comment('1-7 for Monday-Sunday');
            $table->text('notes')->nullable();
            $table->integer('sort_order')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workout_plan_exercises');
    }
};
