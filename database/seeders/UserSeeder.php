<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //======== Coneccion API ======== 
        //======== USER ID 1 ======== 
        User::create([
            'username' => "%9@8z2#3#Y946%^%",
            'name' => "API",
            'lastname' => "Legso",
            'email' => null,
            'url_data_id' => null,
            'password' => "jXNm66XVvLAcIO5RVatOgmkMiyE=",
        ]);
        //======== USER ID 2 ======== 
        $user = User::create([
            'username' => "alumno",
            'name' => "Sebastian",
            'lastname' => "Legnazzi",
            'email' => "asd1@gmail.com",
            'url_data_id' => null,
            'password' => "fEqNCco3Yq9h5ZUglD3CZJT4lBs=",
        ]);
        $user->roles()->attach(4);

        //======== USER ID 3 ======== 
        $user = User::create([
            'username' => "admin",
            'name' => "Dariana",
            'lastname' => "Sosa",
            'email' => "sebileg@hotmail.com",
            'url_data_id' => 10,
            'password' => "fEqNCco3Yq9h5ZUglD3CZJT4lBs=",
        ]);
        $user->roles()->attach(1);
        $user->roles()->attach(2);
        $user->roles()->attach(3);
        $user->roles()->attach(4);

         //======== USER ID 4 ======== 
         $user = User::create([
            'username' => "instructor",
            'name' => "gabriela",
            'lastname' => "Gabriela",
            'email' => "asd3@gmail.com",
            'url_data_id' => 12,
            'password' => "fEqNCco3Yq9h5ZUglD3CZJT4lBs=",
        ]);
        $user->roles()->attach(2);

         //======== USER ID 5 ======== 
         $user = User::create([
            'username' => "usuario",
            'name' => "Roberto",
            'lastname' => "Garcia",
            'email' => "darianagsm@gmail.com",
            'url_data_id' => null,
            'password' => "fEqNCco3Yq9h5ZUglD3CZJT4lBs=",
        ]);
        $user->roles()->attach(1);

        //======== USER ID 6 ======== 
        $user = User::create([
            'username' => "instructor2",
            'name' => "Dario",
            'lastname' => "Garcia",
            'email' => "sebileg321@hotmail.com",
            'url_data_id' => null,
            'password' => "fEqNCco3Yq9h5ZUglD3CZJT4lBs=",
        ]);
        $user->roles()->attach(2);
        //======== USER ID 7 ======== 
        $user = User::create([
            'username' => "instructor3",
            'name' => "Juan",
            'lastname' => "Garcia",
            'email' => "instructor3@gmail.com",
            'url_data_id' => null,
            'password' => "fEqNCco3Yq9h5ZUglD3CZJT4lBs=",
        ]);
        $user->roles()->attach(2);

        //======== USER ID 8 ======== 
        $user = User::create([
            'username' => "alumno2",
            'name' => "Josefino",
            'lastname' => "Perez",
            'email' => "alumno2@gmail.com",
            'url_data_id' => null,
            'password' => "fEqNCco3Yq9h5ZUglD3CZJT4lBs=",
        ]);
        $user->roles()->attach(4);

         //======== USER ID 9 ======== 
         $user = User::create([
            'username' => "alumno3",
            'name' => "Laura",
            'lastname' => "Perez",
            'email' => "alumno3@gmail.com",
            'url_data_id' => null,
            'password' => "fEqNCco3Yq9h5ZUglD3CZJT4lBs=",
        ]);
        $user->roles()->attach(4);
    }
}
