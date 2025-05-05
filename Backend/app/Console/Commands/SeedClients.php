<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\ClientSeeder;

class SeedClients extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seed:clients';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed the database with 30 sample clients';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Seeding 30 clients...');
        
        $seeder = new ClientSeeder();
        $seeder->setCommand($this);
        $seeder->run();
        
        $this->info('Clients seeded successfully!');
        
        return Command::SUCCESS;
    }
}
