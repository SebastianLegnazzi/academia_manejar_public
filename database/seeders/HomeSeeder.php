<?php

namespace Database\Seeders;

use App\Models\DataHome;
use Illuminate\Database\Seeder;

class HomeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //======== ID 1 - HOME ======== 
         DataHome::create([
             'urlInstruct' => "pdf/INSTRUCTIVO_ACADEMIA_MANEJAR.pdf",
        //TODO proxima implementacion
        //     'location' => null,
        //     'cellphone' => null,
         ]);
    }
}
