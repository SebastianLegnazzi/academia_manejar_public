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
        Schema::create('question_exam', function (Blueprint $table) {
            $table->id();
            $table->string('img')->nullable();                  //Imagen de la pregunta
            $table->longText('title');                //Titulo de la pregunta
            $table->longText('answers');              //Respuestas de la pregunta
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_exam');
    }
};
