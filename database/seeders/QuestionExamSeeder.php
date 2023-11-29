<?php

namespace Database\Seeders;

use App\Models\QuestionExam;
use Illuminate\Database\Seeder;

class QuestionExamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = json_decode(file_get_contents(storage_path('app/public/questions.json')), true)['questions'];

        foreach ($questions as $question) {
            QuestionExam::create([
                'img' => isset($question['img']) ? $question['img'] : null,
                'title' => $question['text'],
                'answers' => json_encode($question['responses']),
            ]);
        }
    }
}
