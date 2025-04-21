<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Coach;
use Illuminate\Support\Facades\Hash;

class CoachSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Coach::create([
            'gym_id' => 1, // Assuming FitZone Gym has ID 1 from GymSeeder
            'first_name' => 'John',
            'last_name' => 'Fitness',
            'email' => 'coach@fitzonegym.com',
            'phone' => '+212 522 123459',
            'password' => Hash::make('password123'),
            'specialization' => 'Strength Training',
            'certification' => 'NASM Certified Personal Trainer',
            'hire_date' => '2023-01-15',
            'bio' => 'Experienced strength coach with 5+ years helping clients achieve their fitness goals.',
            'hourly_rate' => 300.00,
            'is_active' => true,
            'profile_image_url' => null,
            'last_login' => now(),
        ]);
        
        Coach::create([
            'gym_id' => 1,
            'first_name' => 'Sarah',
            'last_name' => 'Cardio',
            'email' => 'sarah@fitzonegym.com',
            'phone' => '+212 522 123460',
            'password' => Hash::make('password123'),
            'specialization' => 'Cardio & HIIT',
            'certification' => 'ACE Certified Group Fitness Instructor',
            'hire_date' => '2023-03-10',
            'bio' => 'Passionate about helping clients improve cardiovascular health through high-intensity workouts.',
            'hourly_rate' => 250.00,
            'is_active' => true,
            'profile_image_url' => null,
            'last_login' => now(),
        ]);
    }
}
