<?php

namespace Database\Seeders;

use App\Models\GymProduct;
use App\Models\Gym;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create 20 products
        GymProduct::factory()
            ->count(20)
            ->create();
            
        $this->command->info('20 products created successfully!');
    }
}
