<?php

namespace Database\Seeders;

use App\Models\Menu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ID 1 - Editar Curso
        Menu::create([
            'name' => 'Editar Curso',
            'route' => '/edit_course'
        ]);
        // ID 2 - Editar Carrousel
        Menu::create([
            'name' => 'Editar Imagenes',
            'route' => '/edit_carrousel'
        ]);
        // ID 3 - Editar Tiempos
        Menu::create([
            'name' => 'Editar Tiempos',
            'route' => '/edit_date'
        ]);
        // ID 4 - Editar Vehiculos
        Menu::create([
            'name' => 'Editar Vehiculos',
            'route' => '/edit_car'
        ]);
        // ID 5 - Preguntas y respuestas Instructor
        Menu::create([
            'name' => 'Preguntas',
            'route' => '/main_question_instruct'
        ]);
        // ID 6 - Preguntas y respuestas Alumno
        Menu::create([
            'name' => 'Preguntas',
            'route' => '/main_question_alumn'
        ]);
        // ID 7 - Mi Perfil
        Menu::create([
            'name' => 'Mi perfil',
            'route' => '/profile'
        ]);
        // ID 8 - Mis cursos
        Menu::create([
            'name' => 'Mis Cursos',
            'route' => '/my_curse'
        ]);
        // ID 9 - Mis Turnos
        Menu::create([
            'name' => 'Turnos',
            'route' => '/turn'
        ]);
        // ID 10 - Examen
        Menu::create([
            'name' => 'Examen',
            'route' => '/exam'
        ]);
         // ID 11 - Pagos
         Menu::create([
            'name' => 'Gestionar Pagos',
            'route' => '/payments'
        ]);
        // ID 12 - Itinerario de clases
        Menu::create([
            'name' => 'Mi itinerario',
            'route' => '/itinerary'
        ]);
        // ID 13 - Hacer Reseñas
        Menu::create([
            'name' => 'Mis reseñas',
            'route' => '/review'
        ]);

        // ID 14 - Ver todas las reseñas
        Menu::create([
            'name' => 'Reseñas',
            'route' => '/reviewA'
        ]);

        // ID 15 - Estadisticas
        Menu::create([
            'name' => 'Estadísticas',
            'route' => '/statistics'
        ]);
    }
}
