<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('result_exam', function (Blueprint $table) {
            $table->id();
            $table->integer('correct');                         //Cantidad de respuestas correctas
            $table->integer('incorrect');                       //Cantidad de respuestas incorrectas
            $table->integer('min_approved');                     //Porcentaje de aprobacion
            $table->unsignedBigInteger('exam_id')->nullable();   //ID del examen (en caso de existir)
            $table->foreignId('user_alumn_id')->constrained('users');   //ID del alumno
            $table->integer('result');                                  //Resultado del usuario
            $table->integer('time_exam');                               //Tiempo tardado en segundos
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('exam_id')->references('id')->on('exams');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('result_exam');
    }
};
