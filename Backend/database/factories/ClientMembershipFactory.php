<?php

namespace Database\Factories;

use App\Models\ClientMembership;
use App\Models\MembershipPlan;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientMembershipFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ClientMembership::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Get a random membership plan ID from the database
        $membershipPlanId = MembershipPlan::pluck('id')->random();
        
        // If no membership plans exist, use ID 1 as default
        if (!$membershipPlanId) {
            $membershipPlanId = 1;
        }
        
        // Get the duration of the membership plan
        $durationDays = MembershipPlan::find($membershipPlanId)->duration_days ?? 30;
        
        $startDate = $this->faker->dateTimeBetween('-1 year', 'now');
        $endDate = (clone $startDate)->modify("+{$durationDays} days");
        
        // Determine if the membership is active based on the end date
        $isActive = $endDate > now();
        
        return [
            'membership_plan_id' => $membershipPlanId,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'status' => $isActive ? 'active' : 'expired',
            'auto_renew' => $this->faker->boolean(30), // 30% chance of auto-renewal
            'payment_method' => $this->faker->randomElement(['Cash', 'Credit Card', 'Bank Transfer', 'PayPal']),
        ];
    }
}
