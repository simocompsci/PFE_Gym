<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Admin::create([
            'gym_id' => 1, // Assuming FitZone Gym has ID 1 from GymSeeder
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@fitzonegym.com',
            'phone' => '+212 522 123457',
            'password' => Hash::make('password123'),
            'is_owner' => true,
            'last_login' => now(),
        ]);
    
        Admin::create([
            'gym_id' => 1,
            'first_name' => 'Manager',
            'last_name' => 'Assistant',
            'email' => 'manager@fitzonegym.com',
            'phone' => '+212 522 123458',
            'password' => Hash::make('password123'),
            'is_owner' => false,
            'last_login' => now(),
        ]);
    }
}
