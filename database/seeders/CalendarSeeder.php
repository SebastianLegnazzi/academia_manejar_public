<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Calendar;

class CalendarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        Calendar::create([
            'day_start' => '2023-09-07',
            'day_end' => '2023-11-20',
            'time_start' => '08:00:00',
            'time_end' => '19:00:00',
            'cant_turns_xday' => 10,
        ]);
        
    }
}
