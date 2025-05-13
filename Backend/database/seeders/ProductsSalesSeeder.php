<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\GymProduct;
use App\Models\Client;
use Carbon\Carbon;

class ProductsSalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Creates sales data for all products across every month of the year
     */
    public function run(): void
    {
        $this->command->info('Seeding product sales data...');

        // Get all products
        $products = GymProduct::all();

        // Get all clients for random assignment
        $clients = Client::all();

        if ($products->isEmpty()) {
            $this->command->error('No products found. Please run the ProductSeeder first.');
            return;
        }

        if ($clients->isEmpty()) {
            $this->command->info('No clients found. Sales will be created without client association.');
        }

        $paymentMethods = ['Credit Card', 'Cash', 'Debit Card', 'Mobile Payment'];
        $salesCount = 0;
        $currentYear = Carbon::now()->year;

        // Create sales data for each product across all months
        foreach ($products as $product) {
            // Skip inactive products
            if (!$product->is_active) {
                continue;
            }

            // Create sales for each month (January to December)
            for ($month = 1; $month <= 12; $month++) {
                // Generate 3-8 sales per product per month
                $salesPerMonth = rand(3, 8);

                for ($i = 0; $i < $salesPerMonth; $i++) {
                    // Random day of the month
                    $day = rand(1, 28);

                    // Create a date for the current month
                    $saleDate = Carbon::create($currentYear, $month, $day, rand(8, 20), rand(0, 59), rand(0, 59));

                    // Random quantity between 1 and 5
                    $quantity = rand(1, 5);

                    // Apply a small random discount or premium to the price (±10%)
                    $unitPrice = $product->price * (1 + (rand(-10, 10) / 100));
                    $unitPrice = round($unitPrice, 2);

                    // Calculate total amount
                    $totalAmount = $quantity * $unitPrice;

                    // Random client (or null if no clients)
                    $clientId = $clients->isEmpty() ? null : $clients->random()->id;

                    // Insert the sale record
                    DB::table('product_sales')->insert([
                        'product_id' => $product->id,
                        'client_id' => $clientId,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'total_amount' => $totalAmount,
                        'sale_date' => $saleDate,
                        'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                        'notes' => rand(0, 10) > 8 ? 'Customer requested gift wrapping' : null,
                    ]);

                    $salesCount++;
                }
            }
        }

        $this->command->info("Successfully created {$salesCount} product sales records across all months!");
    }
}
