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
        Schema::create('comment_answer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_alumn_id')->constrained('users');   //ID del alumno
            $table->unsignedBigInteger('user_instruct_id')->nullable(); //ID del instructor
            $table->string('question');                                 //Pregunta del alumno
            $table->string('answer')->nullable();                       //Respuesta del instructor
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_instruct_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comment_answer');
    }
};
