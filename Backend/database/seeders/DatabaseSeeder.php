<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // First create the gym
        $this->call(GymSeeder::class);

        // Then create the users
        $this->call([
            AdminSeeder::class,
            CoachSeeder::class,
            SecretarySeeder::class,
        ]);

        // Create clients with memberships
        $this->call(ClientSeeder::class);
        $this->call(ClassSeeder::class);

        // Create products and their sales data
        $this->call(ProductSeeder::class);
        $this->call(ProductsSalesSeeder::class);


    }
}
