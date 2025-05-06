<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\ProductSeeder;

class SeedProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with 20 sample products';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Seeding 20 products...');
        
        $seeder = new ProductSeeder();
        $seeder->setCommand($this);
        $seeder->run();
        
        $this->info('Products seeded successfully!');
        
        return Command::SUCCESS;
    }
}
