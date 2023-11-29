<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\MenuRol;

class MenuRolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 1 = USUARIO
     * 2 = INSTRUCTOR
     * 3 = ADMIN
     * 4 = ALUMNO
     */
    public function run(): void
    {

        // ========== ADMIN ==========

        // ADMIN - Mi Perfil
        MenuRol::create([
            'rol_id' => 3,
            'menu_id' => 7,
        ]);

        // ADMIN - Editar Curso
        MenuRol::create([
            'rol_id' => 3,
            'menu_id' => 1,
        ]);

        // ADMIN - Editar Carrousel
        MenuRol::create([
            'rol_id' => 3,
            'menu_id' => 2,
        ]);

        // ADMIN - Editar Tiempos
        MenuRol::create([
            'rol_id' => 3,
            'menu_id' => 3,
        ]);

        // ADMIN - Editar Vehiculos
        MenuRol::create([
            'rol_id' => 3,
            'menu_id' => 4,
        ]);

        // ADMIN - Preguntas y respuestas Instructor
        MenuRol::create([
            'rol_id' => 3,
            'menu_id' => 5,
        ]);

        // ADMIN - Preguntas y respuestas Instructor
        MenuRol::create([
            'rol_id' => 3,
            'menu_id' => 11,
        ]);

        // INSTRUCTOR - Reseñas hechas por los alumnos
        MenuRol::create([
            'rol_id' => 3,
            'menu_id' => 14,
        ]);

        // ========== INSTRUCTOR ==========

        // INSTRUCTOR - Mi Perfil
        MenuRol::create([
            'rol_id' => 2,
            'menu_id' => 7,
        ]);

        // INSTRUCTOR - Preguntas y respuestas Instructor
        MenuRol::create([
            'rol_id' => 2,
            'menu_id' => 5,
        ]);

        // INSTRUCTOR - Itinerario de clases
        MenuRol::create([
            'rol_id' => 2,
            'menu_id' => 12,
        ]);

        // ========== USUARIO ==========

        // USUARIO - Mi Perfil
        MenuRol::create([
            'rol_id' => 1,
            'menu_id' => 7,
        ]);

        // USUARIO - Preguntas y respuestas Alumno
        MenuRol::create([
            'rol_id' => 1,
            'menu_id' => 6,
        ]);

        // USUARIO - Examen
        MenuRol::create([
            'rol_id' => 1,
            'menu_id' => 10,
        ]);

        // USUARIO - Estadisticas
        MenuRol::create([
            'rol_id' => 1,
            'menu_id' => 15,
        ]);

        // ========== ALUMNO ==========

        // ALUMNO - Mi Perfil
        MenuRol::create([
            'rol_id' => 4,
            'menu_id' => 7,
        ]);

        // ALUMNO - Mis cursos
        MenuRol::create([
            'rol_id' => 4,
            'menu_id' => 8,
        ]);

        // ALUMNO - Preguntas y respuestas Alumno
        MenuRol::create([
            'rol_id' => 4,
            'menu_id' => 6,
        ]);

        // ALUMNO - Examen
        MenuRol::create([
            'rol_id' => 4,
            'menu_id' => 10,
        ]);

        // ALUMNO - Reseñas
        MenuRol::create([
            'rol_id' => 4,
            'menu_id' => 13,
        ]);
        
        // ALUMNO - Estadisticas
        MenuRol::create([
            'rol_id' => 4,
            'menu_id' => 15,
        ]);
    }
}
