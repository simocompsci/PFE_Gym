<?php

namespace Database\Factories;

use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

class GymFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Gym::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->company() . ' Fitness',
            'address' => $this->faker->address(),
            'phone' => $this->faker->phoneNumber(),
            'email' => $this->faker->companyEmail(),
            'opening_hours' => json_encode([
                'monday' => ['06:00', '22:00'],
                'tuesday' => ['06:00', '22:00'],
                'wednesday' => ['06:00', '22:00'],
                'thursday' => ['06:00', '22:00'],
                'friday' => ['06:00', '22:00'],
                'saturday' => ['08:00', '20:00'],
                'sunday' => ['08:00', '18:00'],
            ]),
            'is_active' => true,
        ];
    }
}
