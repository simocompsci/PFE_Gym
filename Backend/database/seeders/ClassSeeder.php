<?php

namespace Database\Seeders;

use App\Models\GymClass;
use App\Models\Coach;
use App\Models\Gym;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Check if we have coaches, if not create one
        if (Coach::count() === 0) {
            Coach::create([
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'john.doe@example.com',
                'password' => bcrypt('password'),
                'phone' => '123-456-7890',
                'speciality' => 'Fitness',
                'gym_id' => 1,
            ]);
        }
        
        // Create 15 classes
        GymClass::factory()
            ->count(15)
            ->create();
            
        $this->command->info('15 classes created successfully!');
    }
}
