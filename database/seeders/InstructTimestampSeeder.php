<?php

namespace Database\Seeders;

use App\Models\InstructTimeStamp;
use Illuminate\Database\Seeder;

class InstructTimestampSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        InstructTimeStamp::create([
            'user_instruct_id' => 6,
            'car_m_id' => 1, // 'Honda Civic
            'car_t_id' => 1, // 'Volkswagen Golf
            'time_start' => '08:00:00',
            'time_end' => '18:00:00',
        ]);
        InstructTimeStamp::create([
            'user_instruct_id' => 7,
            'car_m_id' => null,
            'car_t_id' => 2, // 'Honda Civic
            'time_start' => '13:00:00',
            'time_end' => '19:00:00',
        ]);
        InstructTimeStamp::create([
            'user_instruct_id' => 4,
            'car_m_id' => null,
            'car_t_id' => 3, // 'Ford F-150
            'time_start' => '13:00:00',
            'time_end' => '19:00:00',
        ]);


        $instruct4 = InstructTimeStamp::create([
            'user_instruct_id' => 4,
            'car_m_id' => 4, // 'Toyota Camry
            'car_t_id' => 5,
            'time_start' => '08:00:00',
            'time_end' => '12:00:00',
        ]);
        $instruct4->delete();
        
    }
}
