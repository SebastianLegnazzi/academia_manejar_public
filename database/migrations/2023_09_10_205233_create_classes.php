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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('turn_id')->constrained('turn');      //ID del turno
            $table->boolean('assistance')->nullable();                          //Asistencia del alumno
            $table->string('observation')->nullable();                          //Observacion del instructor
            $table->boolean('cancelled')->nullable();                           //Cancelado por algun motivo
            $table->string('motive_cancelled')->nullable();                     //Motivo de cancelacion
            $table->datetime('date');
            $table->timestamps();
            $table->softDeletes();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};
