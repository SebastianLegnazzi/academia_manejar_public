<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //======== ID 1 - Curso ======== 
        Course::create([
            'url_data_id' => 13,
            'title' => "MEDIO CURSO",
            'price' => "25000",
            'price_reservation' => "1000",
            'cant_class' => 10,
            'features' => "
           10 clases prácticas &
           Una clase teórica &
           Clases de media hora &
           Auto con caja manual &
           Un examen escrito &
           Dudas resueltas al momento por el instructor &
           Prácticas de estacionamiento &
           Clases en tránsito real &
           Te llevamos a rendir el examen (Consultar precio) &
           Descuento en efectivo &
            ",
        ]);
        //======== ID 2 - Curso ======== 
        Course::create([
            'url_data_id' => 14,
            'title' => "CURSO COMPLETO",
            'price' => "35000",
            'cant_class' => 20,
            'price_reservation' => "1000",
            'features' => "
          20 clases prácticas &
          Una clase teórica &
          Clases de media hora &
          Auto con caja manual &
          Un examen escrito &
          Dudas resueltas al momento por el instructor &
          Prácticas de estacionamiento &
          Clases en tránsito real &
          Te llevamos a rendir el examen (Consultar precio) &
          Descuento en efectivo &
            ",
        ]);
    }
}
