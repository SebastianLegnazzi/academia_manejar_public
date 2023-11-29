<?php

namespace Database\Seeders;

use App\Models\Exam;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Exam::create([
            'type' => 'Examen Libre',
            'quantity_question' => 0,
            'time' => 0,
            'min_approved' => 0,
        ]);

        Exam::create([
            'type' => 'Examen Real',
            'quantity_question' => 44,
            'time' => 45,
            'min_approved' => 80,
        ]);

        Exam::create([
            'type' => 'Simulacro',
            'quantity_question' => 40,
            'time' => 60,
            'min_approved' => 70,
        ]);
    }
}
