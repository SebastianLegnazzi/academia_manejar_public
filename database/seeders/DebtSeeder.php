<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Debt;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DebtSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //======== ID 1 - Debt ======== 
        Debt::create([
            'concept' => 'CURSO COMPLETO',
            'total_debt' => 24000,
            'saldo' => 24000,
            'turns_id' => 1,
        ]);
        //======== ID 2 - Debt ======== 
        Debt::create([
            'concept' => "RESERVA CURSO COMPLETO",
            'total_debt' => 1000,
            'saldo' => 0,
            'turns_id' => 1,
        ]);
    }
}
