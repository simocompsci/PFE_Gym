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
        Schema::create('client_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('coach_id')->nullable()->constrained('coaches')->onDelete('set null');
            $table->string('goal_type', 50)->comment('e.g., weight_loss, strength');
            $table->string('target_value', 50);
            $table->string('current_value', 50)->nullable();
            $table->date('start_date');
            $table->date('target_date')->nullable();
            $table->boolean('is_achieved')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_goals');
    }
};
