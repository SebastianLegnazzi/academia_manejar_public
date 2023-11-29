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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('url_data_id')->nullable();  //ID de la tabla donde se encuentra la imagen
            $table->string('title');                                //Titulo del curso
            $table->string('price');                                //Precio del curso
            $table->string('price_reservation');                    //Precio de la reserva
            $table->unsignedBigInteger('cant_class');               //Cantidad de clases
            $table->string('features', 10000)->nullable();          //Caracteristicas del curso
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('url_data_id')->references('id')->on('url_data');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
