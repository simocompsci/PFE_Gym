<?php

namespace Database\Factories;

use App\Models\GymProduct;
use App\Models\Gym;
use Illuminate\Database\Eloquent\Factories\Factory;

class GymProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = GymProduct::class;

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
        
        $categories = ['Supplements', 'Apparel', 'Equipment', 'Accessories', 'Nutrition'];
        
        $products = [
            [
                'name' => 'HydroSync Pro Water Bottle',
                'description' => 'Stay on top of your daily water intake with this innovative bottle featuring built-in hydration reminders and Bluetooth connectivity.',
                'price' => 29.99,
                'image' => 'https://imgs.search.brave.com/twCNCnJmuRsTKJZgtXDXwkHZXOedbeSlPSUBX0MOT7Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcy/NDEzOTkyL3Bob3Rv/L3NpbHZlci1ib3R0/bGUuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXhGMXFtbzRm/Vld3MTVGaDJJaklX/NVZuRDlLV0xiUV9o/dkdFaHV4SXRvTU09',
                'category' => 'Accessories'
            ],
            [
                'name' => 'Smart Fitness Tracker',
                'description' => 'Track your workouts and health metrics with this stylish and waterproof fitness tracker.',
                'price' => 89.99,
                'image' => 'https://imgs.search.brave.com/YkSA2abH0HeTCEoh25BhXnx3RPD9Eh-MVDhhIJRm2SQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzF2ZE5qc3RKTEwu/anBn',
                'category' => 'Accessories'
            ],
            [
                'name' => 'Ergo Yoga Mat',
                'description' => 'Premium non-slip yoga mat for all your stretching and yoga needs.',
                'price' => 45.99,
                'image' => 'https://imgs.search.brave.com/8JMK0jgUCl15w6deTcpm-ZWVFBNzFGBaV9ZAH8X4jmY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFJZnZOYXkxc0wu/anBn',
                'category' => 'Equipment'
            ],
            [
                'name' => 'Wireless Earbuds',
                'description' => 'Enjoy your music with crystal clear sound and noise cancellation.',
                'price' => 110.99,
                'image' => 'https://imgs.search.brave.com/ozlnyR1eVc8flL5Cd-DWQmmigU9xlY2-FfNn5TqoOuo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/ZGlnaXRhbHRyZW5k/cy5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjIvMDEvMS1z/a3VsbGNhbmR5LWlu/ZHktZXZvLXRydWUt/d2lyZWxlc3MtaW4t/ZWFyLWhlYWRwaG9u/ZXMtdHJ1ZS1ibGFj/ay5qcGc_cmVzaXpl/PTEyMDAsNzIwJnA9/MQ',
                'category' => 'Accessories'
            ],
            [
                'name' => 'Stainless Steel Shaker',
                'description' => 'Mix your protein shakes on the go with this durable shaker bottle.',
                'price' => 25.99,
                'image' => 'https://imgs.search.brave.com/ONdBKCe995MRSalJ_o8wFgXw-IM_4-bHVc8DyHMzEQ4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NTFYS1BBc1N0Y0wu/anBn',
                'category' => 'Accessories'
            ],
            [
                'name' => 'Resistance Bands Set',
                'description' => 'Versatile resistance bands for home and gym workouts.',
                'price' => 32.99,
                'image' => 'https://imgs.search.brave.com/wehOLumcbL5MqUt6loaMtNJnu7gMsQ0HCgETGcjPJkY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFzMS13Zjhzd0wu/anBn',
                'category' => 'Equipment'
            ],
            [
                'name' => 'Foam Roller',
                'description' => 'Release muscle tension and improve recovery with this high-density foam roller.',
                'price' => 28.99,
                'image' => 'https://imgs.search.brave.com/MURxr_-GamvrJvQV6jLPttCtlod4k51LtKEij31l3QI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzE2Lzk0LzE5/LzM2MF9GXzMxNjk0/MTkyOF83cjk3WE1S/VnYzRndCMFhhczZD/TTA3R09QcWxOZmZM/ZC5qcGc',
                'category' => 'Equipment'
            ],
            [
                'name' => 'Sports Backpack',
                'description' => 'Spacious and stylish backpack for all your gym and travel needs.',
                'price' => 60.99,
                'image' => 'https://imgs.search.brave.com/dOplZBJFGej8C1lV-KYbUNUzDlHBnyl6FV2rsMptH30/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFNUFFvTlZVekwu/anBn',
                'category' => 'Apparel'
            ],
            [
                'name' => 'Digital Jump Rope',
                'description' => 'Track your jumps and calories burned with this smart jump rope.',
                'price' => 35.99,
                'image' => 'https://imgs.search.brave.com/aDIzvyF7G6iaEd48lVQLdkfyKN25Oz9xrf4mpdgJgBY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/ODFGMGJZZjNET0wu/anBn',
                'category' => 'Equipment'
            ],
            [
                'name' => 'Protein Powder',
                'description' => 'High-quality protein powder for muscle recovery and growth.',
                'price' => 49.99,
                'image' => 'https://imgs.search.brave.com/Yx9Qd6oCXBYypUZQWy3lfVfVlYJ9ZZjYQpAGkREK9Yk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFCUWJnRWVVdkwu/anBn',
                'category' => 'Supplements'
            ],
        ];
        
        $product = $this->faker->randomElement($products);
        
        return [
            'gym_id' => $gymId,
            'name' => $product['name'],
            'description' => $product['description'],
            'price' => $product['price'],
            'cost' => $this->faker->randomFloat(2, 5, $product['price'] * 0.7),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'category' => $product['category'],
            'image_url' => $product['image'],
            'is_active' => $this->faker->boolean(90), // 90% chance of being active
        ];
    }
}
