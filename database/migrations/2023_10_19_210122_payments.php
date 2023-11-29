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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('debts_id')->nullable(); //ID de la deuda pagada 
            $table->integer('total_payment');                   //Total pagado
            $table->string('method');                           //Forma de pago
            $table->timestamps();

            $table->foreign('debts_id')->references('id')->on('debts'); //Relacion con la tabla debts
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
