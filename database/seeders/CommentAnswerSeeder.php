<?php

namespace Database\Seeders;

use App\Models\CommentAnswer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentAnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //======== ID 1 - Curso ======== 
        CommentAnswer::create([
            'user_alumn_id' => 2,
            'user_instruct_id' => 4,
            'question' => "Como estas",
            'answer' => "bien y tu",
        ]);
        //======== ID 2 - Curso ======== 
        CommentAnswer::create([
            'user_alumn_id' => 2,
            'user_instruct_id' => 4,
            'question' => "No me anda el freno",
            'answer' => null,
        ]);
        //======== ID 3 - Curso ======== 
        CommentAnswer::create([
            'user_alumn_id' => 2,
            'user_instruct_id' => 4,
            'question' => "puedo estacionarme al reves",
            'answer' => null,
        ]);
        //======== ID 4 - Curso ======== 
        CommentAnswer::create([
            'user_alumn_id' => 2,
            'user_instruct_id' => 4,
            'question' => "dfdfgdfgfdg",
            'answer' => null,
        ]);
        //======== ID 6 - Curso ======== 
        CommentAnswer::create([
            'user_alumn_id' => 2,
            'user_instruct_id' => 4,
            'question' => "puedo faltar mañana?",
            'answer' => "jaja no",
        ]);
    }
}
