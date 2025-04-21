<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Gym;

class GymSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Gym::create([
            'name' => 'FitZone Gym',
            'address' => '123 Fitness Street',
            'city' => 'Casablanca',
            'state' => 'Grand Casablanca',
            'phone' => '+212 522 123456',
            'email' => 'info@fitzonegym.com',
            'opening_time' => '06:00:00',
            'closing_time' => '22:00:00',
            'logo_url' => null,
        ]);
    }
}
