<?php

namespace Database\Factories;

use App\Models\GymClass;
use App\Models\Coach;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

class GymClassFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = GymClass::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Get a random coach ID from the database
        $coachId = Coach::pluck('id')->random();

        // If no coaches exist, use ID 1 as default
        if (!$coachId) {
            $coachId = 1;
        }

        // Get a random gym ID from the database
        $gymId = Gym::pluck('id')->random();

        // If no gyms exist, use ID 1 as default
        if (!$gymId) {
            $gymId = 1;
        }

        $classTypes = [
            ['name' => 'Yoga', 'description' => 'A relaxing yoga class for all levels.', 'color' => '#f9e79f'],
            ['name' => 'HIIT', 'description' => 'High-intensity interval training to get your heart pumping!', 'color' => '#fad7a0'],
            ['name' => 'Pilates', 'description' => 'Strengthen your core and improve flexibility.', 'color' => '#b7e3fa'],
            ['name' => 'Zumba', 'description' => 'Dance your way to fitness with this fun cardio workout.', 'color' => '#fadbd8'],
            ['name' => 'Spinning', 'description' => 'Indoor cycling class that will push your limits.', 'color' => '#d2b4de'],
            ['name' => 'CrossFit', 'description' => 'Functional movements performed at high intensity.', 'color' => '#aed6f1'],
            ['name' => 'Boxing', 'description' => 'Learn boxing techniques while getting a great workout.', 'color' => '#f5cba7'],
            ['name' => 'Kickboxing', 'description' => 'Combine martial arts techniques with fast-paced cardio.', 'color' => '#f9e79f'],
        ];

        $classType = $this->faker->randomElement($classTypes);
        $suffix = $this->faker->randomElement(['Flow', 'Basics', 'Advanced', 'Fusion', 'Express', 'Power', 'Core', 'Extreme']);

        return [
            'name' => $classType['name'] . ' ' . $suffix,
            'description' => $classType['description'],
            'coach_id' => $coachId,
            'gym_id' => $gymId,
            'max_capacity' => $this->faker->numberBetween(10, 30),
            'duration_minutes' => $this->faker->randomElement([30, 45, 60, 90]),
            'color_code' => $classType['color'],
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
        ];
    }
}
