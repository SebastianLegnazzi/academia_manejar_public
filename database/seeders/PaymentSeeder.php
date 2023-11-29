<?php

namespace Database\Seeders;

use App\Models\Payment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ID 1 - Editar Curso
        Payment::create([
            'debts_id' => 1,
            'total_payment' => 1000,
            'method' => 'Mercado Pago',
        ]);
    }
}
