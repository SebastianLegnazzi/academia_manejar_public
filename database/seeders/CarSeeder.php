<?php

namespace Database\Seeders;

use App\Models\Car;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Car::create([
            'model' => 'Toyota Camry',
            'url_data_id' => null,
        ]);
        Car::create([
            'model' => 'Ford F-150',
            'url_data_id' => null,
        ]);
        Car::create([
            'model' => 'Volkswagen Golf',
            'url_data_id' => null,
        ]);
        Car::create([
            'model' => 'Honda Civic',
            'url_data_id' => null,
        ]);
        Car::create([
            'model' => 'Tesla Model 3',
            'url_data_id' => null,
        ]);
    }
}
