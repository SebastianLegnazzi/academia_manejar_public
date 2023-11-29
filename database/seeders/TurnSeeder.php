<?php

namespace Database\Seeders;

use App\Models\Turn;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TurnSeeder extends Seeder
{
    public function run(): void
    {
        // Turn 1
        Turn::create([
            'date_turn_ini' => Carbon::parse('2023-10-05 08:00:00'), // Hora 8:00 AM
            'date_turn_end' => Carbon::parse('2023-10-20 08:30:00'), // Hora 8:30 AM
            'car_id' => 1,
            'courses_id' => 2,
            'instruct_timestamp_id' => 1,
            'user_alumn_id' => 9,

        ]);

        // // Turn 2
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2023-10-10 08:00:00'), // Hora 8:00 AM
        //     'date_turn_end' => Carbon::parse('2023-10-19 08:30:00'), // Hora 5:00 PM
        //     'car_id' => 1,
        //     'courses_id' => 2,
        //     'instruct_timestamp_id' => 2,
        //     'user_alumn_id' => 9,

        // ]);

        // // Turn 3
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2023-10-02 08:00:00'), // Hora 8:00 AM
        //     'date_turn_end' => Carbon::parse('2023-10-12 08:30:00'), // Hora 5:00 PM
        //     'car_id' => 1,
        //     'courses_id' => 2,
        //     'instruct_timestamp_id' => 3,
        //     'user_alumn_id' => 9,

        // ]);

        // // Turn 4
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2023-10-01 09:00:00'), // Hora 9:00 AM
        //     'date_turn_end' => Carbon::parse('2023-10-22 16:00:00'), // Hora 4:00 PM
        //     'car_id' => 2,
        //     'courses_id' => 1,
        //     'instruct_timestamp_id' => 2,
        //     'user_alumn_id' => 8,

        // ]);

        // // Turn 5
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2023-12-22 10:00:00'), // Hora 10:00 AM
        //     'date_turn_end' => Carbon::parse('2024-01-01 18:00:00'), // Hora 6:00 PM
        //     'car_id' => 3,
        //     'courses_id' => 2,
        //     'instruct_timestamp_id' => 3,
        //     'user_alumn_id' => 9,

        // ]);

        // // Turn 6
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2024-01-01 08:30:00'), // Hora 8:30 AM
        //     'date_turn_end' => Carbon::parse('2024-01-22 16:30:00'), // Hora 4:30 PM
        //     'car_id' => 4,
        //     'courses_id' => 2,
        //     'instruct_timestamp_id' => 3,
        //     'user_alumn_id' => 2,

        // ]);

        // // Turn 7
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2024-02-01 09:00:00'), // Hora 9:00 AM
        //     'date_turn_end' => Carbon::parse('2024-02-22 17:00:00'), // Hora 5:00 PM
        //     'car_id' => 5,
        //     'courses_id' => 1,
        //     'instruct_timestamp_id' => 1,
        //     'user_alumn_id' => 8,

        // ]);

        // // Turn 8
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2023-10-03 09:00:00'), // Hora 8:00 AM
        //     'date_turn_end' => Carbon::parse('2023-10-21 09:30:00'), // Hora 4:00 PM
        //     'car_id' => 1,
        //     'courses_id' => 2,
        //     'instruct_timestamp_id' => 2,
        //     'user_alumn_id' => 9,

        // ]);
        // // Turn 8
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2023-10-01 09:00:00'), // Hora 8:00 AM
        //     'date_turn_end' => Carbon::parse('2023-10-19 09:30:00'), // Hora 4:00 PM
        //     'car_id' => 1,
        //     'courses_id' => 2,
        //     'instruct_timestamp_id' => 3,
        //     'user_alumn_id' => 9,

        // ]);
        // // Turn 8
        // Turn::create([
        //     'date_turn_ini' => Carbon::parse('2023-10-05 09:00:00'), // Hora 8:00 AM
        //     'date_turn_end' => Carbon::parse('2023-10-15 09:30:00'), // Hora 4:00 PM
        //     'car_id' => 1,
        //     'courses_id' => 2,
        //     'instruct_timestamp_id' => 1,
        //     'user_alumn_id' => 9,

        // ]);
    }
}
