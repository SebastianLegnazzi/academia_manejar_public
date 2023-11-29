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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('model');                                //Modelo del auto
            $table->unsignedBigInteger('url_data_id')->nullable();  //ID de la tabla donde se encuentra la imagen
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
        Schema::dropIfExists('cars');
    }
};
