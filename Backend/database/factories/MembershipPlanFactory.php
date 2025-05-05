<?php

namespace Database\Factories;

use App\Models\MembershipPlan;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

class MembershipPlanFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MembershipPlan::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Get a random gym ID from the database
        $gymId = Gym::pluck('id')->random();
        
        // If no gyms exist, use ID 1 as default
        if (!$gymId) {
            $gymId = 1;
        }
        
        $planTypes = [
            ['name' => 'Bronze', 'price' => 50, 'duration' => 30],
            ['name' => 'Silver', 'price' => 100, 'duration' => 90],
            ['name' => 'Gold', 'price' => 200, 'duration' => 180],
            ['name' => 'Platinum', 'price' => 350, 'duration' => 365],
        ];
        
        $plan = $this->faker->randomElement($planTypes);
        
        return [
            'gym_id' => $gymId,
            'name' => $plan['name'],
            'description' => $this->faker->sentence(8),
            'price' => $plan['price'],
            'duration_days' => $plan['duration'],
            'features' => json_encode([
                'gym_access' => true,
                'classes' => $plan['name'] !== 'Bronze',
                'personal_trainer' => in_array($plan['name'], ['Gold', 'Platinum']),
                'locker' => in_array($plan['name'], ['Gold', 'Platinum']),
                'towel_service' => $plan['name'] === 'Platinum',
            ]),
            'is_active' => true,
        ];
    }
}
