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
        Schema::create('url_data', function (Blueprint $table) {
            $table->id();
            $table->string('url');          //URL del archivo
            $table->string('type');         //Tipo del archivo
            $table->string('section');      //Seccion del archivo
            $table->string('description');  //Descripcion del archivo
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('url_data');
    }
};
