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
        Schema::create('payment_tracking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('membership_id')->nullable()->constrained('client_memberships')->onDelete('set null');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->string('payment_method', 50);
            $table->enum('status', ['completed', 'pending', 'failed', 'refunded'])->default('completed');
            $table->text('notes')->nullable();
            $table->timestamps();

            // Add foreign key for recorded_by (can reference either admins or secretaries)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_tracking');
    }
};
