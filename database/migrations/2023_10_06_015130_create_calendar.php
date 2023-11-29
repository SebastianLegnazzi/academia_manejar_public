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
        Schema::create('calendar', function (Blueprint $table) {
            $table->id();
            $table->date('day_start');              //Fecha de inicio de la clase
            $table->date('day_end');                //Fecha de fin de la clase
            $table->time('time_start');             //Hora de inicio de la clase
            $table->time('time_end');               //Hora de fin de la clase
            $table->integer('cant_turns_xday');     //Cantidad de turnos por dia
            $table->softDeletes();                  // Para el campo 'deleted_at'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar');
    }
};
