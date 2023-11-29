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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username', 100)->unique();      //Nombre de usuario
            $table->string('email')->nullable()->unique();  //Email del usuario
            $table->string('name', 100);                    //Nombre de la persona
            $table->string('lastname', 100);                //Apellido de la persona
            $table->string('nationality')->nullable();                //Apellido de la persona
            $table->string('password');                     //Contraseña del usuario
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
        Schema::dropIfExists('users');
    }
};
