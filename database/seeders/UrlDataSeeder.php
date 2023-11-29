<?php

namespace Database\Seeders;

use App\Models\UrlData;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UrlDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //<-----------------------IMAGENES CARROUESEL-------------------------->
        UrlData::create([
            //'id' => '1',
            'url' => "img/carrusel/FwRhyONLq6owhMvYwkq7O3OkB7mP0JLb5I1iWSsc.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 1",
        ]);
        UrlData::create([
            //'id' => '2',
            'url' => "img/carrusel/Bh8tauKoObfnjRdO3o4cbQn8Ock1B7CBVQ3H5f5c.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 2",
        ]);
        UrlData::create([
            //'id' => '3',
            'url' => "img/carrusel/cMMhsoRUOoODjAVZD3NBZxL8evLhqXA7wW7Q2QyA.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 3",
        ]);
        UrlData::create([
            //'id' => '4',
            'url' => "img/carrusel/3ZXDkLQWNsjvgullacpvP3iMfYiSt2yHP5YG5H9E.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 4",
        ]);
        UrlData::create([
            //'id' => '5',
            'url' => "img/carrusel/egSfUr4YYHrpC2b1r0PW4MykJNwoFUQZrCLWre4x.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 5",
        ]);
        UrlData::create([
            //'id' => '6',
            'url' => "img/carrusel/Lw0kk9qq5b4E9VCp1XddgS0uOV4c365gGVcyK5gg.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 6",
        ]);
        UrlData::create([
            //'id' => '7',
            'url' => "img/carrusel/S2j1UsWNJLaRIAlnatGWR3b7SZUoftBds9b9IgnF.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 7",
        ]);
        UrlData::create([
            //'id' => '8',
            'url' => "img/carrusel/mpReimd6SAZM9FA5kwlrQ7Dnf4bfu5DTU7ayP1dz.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 8",
        ]);
        UrlData::create([
            //'id' => '9',
            'url' => "img/carrusel/3YX0wwP3Hr418Rl9oHuCJMwKVkUy3HoMr9SL0lLm.jpg",
            "type" => "imagen",
            "section" => "flota",
            "description" => "Auto 9",
        ]);

        //<-----------------------IMAGENES USUARIOS---------------------------->
        UrlData::create([
            //'id' => '10',
            "url" => "img/users/L2yeNtgPL3ZDIpiNJIE3zpAKodo97LUTGtlRvQ3J.png",
            "type" => "imagen",
            "section" => "user",
            "description" => "Imagen de perfil del usuario admin",
        ]);
        UrlData::create([
            //'id' => '11',
            "url" => "img/users/eqSl4qcUIx2kpx215yQU276HzA4Qpb9bzB5EnOMm.png",
            "type" => "imagen",
            "section" => "user",
            "description" => "Imagen de perfil del usuario ElRobert4",
        ]);
        UrlData::create([
            //'id' => '12',
            "url" => "img/users/OTKrDWPItSU7hF0cfMbu85S27yS9T8piX22Rgd0I.png",
            "type" => "imagen",
            "section" => "user",
            "description" => "Imagen de perfil del usuario instructor",
        ]);

        //<-----------------------IMAGENES CURSOS---------------------------->
        UrlData::create([
            //'id' => '13',
            "url" => "img/curse/KQqPgVVwjNvRNn9blgjWIQuBOznbMnQu01aG41FD.jpg",
            "type" => "imagen",
            "section" => "course",
            "description" => "MEDIO CURSO",
        ]);
        UrlData::create([
            //'id' => '14',
            "url" => "img/curse/Z2dhCLLMZZDJGy6ALuy7E6pN2iVCoxoZrV09odBn.png",
            "type" => "imagen",
            "section" => "courses",
            "description" => "CURSO COMPLETO",
        ]);

        //<-----------------------PDF---------------------------->
        UrlData::create([
            //'id' => '18',
            "url" => "pdf/INSTRUCTIVO_ACADEMIA_MANEJAR.pdf",
            "type" => "pdf",
            "section" => "home",
            "description" => "instructivo",
        ]);
    }
}

/*
"type" => "video"
"type" => "pdf"
"type" => "imagen"
*/
