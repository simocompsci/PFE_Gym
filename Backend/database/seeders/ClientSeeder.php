<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\ClientMembership;
use App\Models\Gym;
use App\Models\MembershipPlan;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Check if we have gyms, if not create one
        if (Gym::count() === 0) {
            Gym::factory()->create([
                'name' => 'Main Fitness Center',
                'address' => '123 Fitness Street, City',
                'phone' => '123-456-7890',
                'email' => 'info@mainfitness.com',
            ]);
        }
        
        // Check if we have membership plans, if not create some
        if (MembershipPlan::count() === 0) {
            $gymId = Gym::first()->id;
            
            MembershipPlan::create([
                'gym_id' => $gymId,
                'name' => 'Bronze',
                'description' => 'Basic membership with gym access',
                'price' => 50,
                'duration_days' => 30,
                'features' => json_encode(['gym_access' => true]),
                'is_active' => true,
            ]);
            
            MembershipPlan::create([
                'gym_id' => $gymId,
                'name' => 'Silver',
                'description' => 'Standard membership with gym access and classes',
                'price' => 100,
                'duration_days' => 90,
                'features' => json_encode(['gym_access' => true, 'classes' => true]),
                'is_active' => true,
            ]);
            
            MembershipPlan::create([
                'gym_id' => $gymId,
                'name' => 'Gold',
                'description' => 'Premium membership with gym access, classes, and personal trainer',
                'price' => 200,
                'duration_days' => 180,
                'features' => json_encode(['gym_access' => true, 'classes' => true, 'personal_trainer' => true, 'locker' => true]),
                'is_active' => true,
            ]);
        }
        
        // Create 30 clients with memberships
        Client::factory()
            ->count(30)
            ->create()
            ->each(function ($client) {
                // Create a membership for each client
                ClientMembership::factory()->create([
                    'client_id' => $client->id,
                ]);
            });
            
        $this->command->info('30 clients created with memberships!');
    }
}
