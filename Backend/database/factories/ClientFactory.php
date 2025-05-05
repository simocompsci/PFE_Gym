<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ClientFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Client::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $gender = $this->faker->randomElement(['male', 'female']);
        $firstName = $gender === 'male' ? $this->faker->firstNameMale() : $this->faker->firstNameFemale();
        
        // Get a random gym ID from the database
        $gymId = Gym::pluck('id')->random();
        
        // If no gyms exist, use ID 1 as default
        if (!$gymId) {
            $gymId = 1;
        }
        
        return [
            'gym_id' => $gymId,
            'first_name' => $firstName,
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'birth_date' => $this->faker->date('Y-m-d', '-18 years'),
            'gender' => $gender,
            'address' => $this->faker->address(),
            'join_date' => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'notes' => $this->faker->optional(0.7)->sentence(6),
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
        ];
    }
}
