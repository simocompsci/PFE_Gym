<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\ClassSeeder;

class SeedClasses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:classes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with 15 sample classes';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Seeding 15 classes...');
        
        $seeder = new ClassSeeder();
        $seeder->setCommand($this);
        $seeder->run();
        
        $this->info('Classes seeded successfully!');
        
        return Command::SUCCESS;
    }
}
