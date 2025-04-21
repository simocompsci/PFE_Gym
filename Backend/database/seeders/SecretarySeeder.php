<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Secretary;
use Illuminate\Support\Facades\Hash;

class SecretarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Secretary::create([
            'gym_id' => 1, // Assuming FitZone Gym has ID 1 from GymSeeder
            'first_name' => 'Amal',
            'last_name' => 'Benani',
            'email' => 'secretary@fitzonegym.com',
            'phone' => '+212 522 123461',
            'password' => Hash::make('password123'),
            'shift_schedule' => 'Morning: 6AM-2PM',
            'hire_date' => '2023-02-01',
            'is_active' => true,
            'last_login' => now(),
        ]);
        
        Secretary::create([
            'gym_id' => 1,
            'first_name' => 'Yasmine',
            'last_name' => 'Alaoui',
            'email' => 'yasmine@fitzonegym.com',
            'phone' => '+212 522 123462',
            'password' => Hash::make('password123'),
            'shift_schedule' => 'Evening: 2PM-10PM',
            'hire_date' => '2023-04-15',
            'is_active' => true,
            'last_login' => now(),
        ]);
    }
}
