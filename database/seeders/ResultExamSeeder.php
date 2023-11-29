<?php

namespace Database\Seeders;

use App\Models\ResultExam;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResultExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ResultExam::create([
            'user_alumn_id' => 1,
            'exam_id' => 1,
            'time_exam' => 10,
            'correct' => 10,
            'incorrect' => 0,
            'result' => 100,
            'min_approved' => 70,
        ]);

        ResultExam::create([
            'user_alumn_id' => 1,
            'exam_id' => 1,
            'time_exam' => 10,
            'correct' => 3,
            'incorrect' => 7,
            'result' => 30,
            'min_approved' => 70,
        ]);

        ResultExam::create([
            'user_alumn_id' => 1,
            'exam_id' => 2,
            'time_exam' => 10,
            'correct' => 5,
            'incorrect' => 5,
            'result' => 50,
            'min_approved' => 70,
        ]);

        ResultExam::create([
            'user_alumn_id' => 1,
            'exam_id' => 2,
            'time_exam' => 30,
            'correct' => 10,
            'incorrect' => 3,
            'result' => 80,
            'min_approved' => 70,
        ]);

        ResultExam::create([
            'user_alumn_id' => 1,
            'exam_id' => 3,
            'time_exam' => 10,
            'correct' => 7,
            'incorrect' => 3,
            'result' => 70,
            'min_approved' => 70,
        ]);
    }
}
