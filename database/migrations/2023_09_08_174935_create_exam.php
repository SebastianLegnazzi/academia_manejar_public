<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * !REVISAR LOGICA CON DARI MI CHIKITA HERMOSA QUE TANTO AMO 💕
     */
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->string('type');                 //Tipo de examen
            $table->integer('quantity_question');   //Cantidad de preguntas
            $table->integer('time');                //Tiempo del examen
            $table->integer('min_approved');        //Minimo aprobatorio
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
