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
        Schema::create('menues_rols', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rol_id')->constrained('roles')->unique();    //ID del rol
            $table->foreignId('menu_id')->constrained('menues')->unique();    //ID del menu
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menues_rols');
    }
};
