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
        Schema::create('instruct_timestamp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_instruct_id')->constrained('users');    //ID del instructor
            $table->unsignedBigInteger('car_m_id')->nullable();             //ID del auto de la mañana (segun corresponda con el horario)
            $table->unsignedBigInteger('car_t_id')->nullable();             //ID del auto de la tarde (segun corresponda con el horario)
            $table->time('time_start');                                     //Hora de inicio de la clase
            $table->time('time_end');                                       //Hora de fin de la clase
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('car_m_id')->references('id')->on('cars');
            $table->foreign('car_t_id')->references('id')->on('cars');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instruct_timestamp');
    }
};
