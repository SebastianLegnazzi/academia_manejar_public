<?php

namespace Database\Seeders;

use App\Models\QuestionExam;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($i = 0; $i < 50; $i++) {
            $turnId = 1; // Genera un ID de turno aleatorio entre 1, 2 y 3
            $score = rand(1, 5); // Genera una puntuación aleatoria entre 1 y 5
            $comment = "Comentario $i"; // Crea un comentario único para cada registro

            DB::table('reviews')->insert([
                'score' => $score,
                'comment' => $comment,
                'turn_id' => $turnId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
