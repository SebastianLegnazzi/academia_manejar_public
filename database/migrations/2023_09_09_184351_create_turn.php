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
        Schema::create('turn', function (Blueprint $table) {
            $table->id();
            $table->datetime('date_turn_ini');
            $table->datetime('date_turn_end');
            $table->foreignId('car_id')->constrained('cars');
            $table->foreignId('courses_id')->constrained('courses');
            $table->foreignId('user_alumn_id')->constrained('users');
            $table->foreignId('instruct_timestamp_id')->constrained('instruct_timestamp');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turn');
    }
};
