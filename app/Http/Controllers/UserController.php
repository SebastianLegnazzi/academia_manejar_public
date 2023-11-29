<?php

namespace App\Http\Controllers;

use App\Models\ForgotPassword;
use App\Models\UrlData;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    /**
     * Funcion que verifica si el usuario y la contraseña son correctos
     * @param string $username
     * @param string $password
     * @return array
     */
    public function login()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                                           //Inicializo la respuesta en false
                $resp['message'] = 'Usuario o email y/o contraseña incorrectos';              //Devuelvo que el usuario y/o contraseña son incorrectos
                $data = $resp['data'];                                                         //Obtengo datos del json
                $data['username'] = str_replace(' ', '', $data['username']);                   //Elimino los espacios en blanco
                $user = $this->searchUser($data['username'], $data['password']);
                $menues = $this->searchMenues($user->id);
                if ($user && $menues) {
                    $resp['message'] = 'Usuario y contraseña correctos';
                    $token = null;
                    if ($data['rememberMe']) {
                        $token = JWTAuth::fromUser($user);                                            //Creo el token
                    }                                                                                //Borro la contraseña
                    $resp['data'] = ['user' => $user, 'token' => $token, 'menues' => $menues];                  //Devuelvo el usuario y el token
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }

    /**
     * Funcion que verifica si el usuario es veridico y ya esta ingresado
     * @param string $username
     * @param string $password
     * @return array
     */
    public function loginAutomatic()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                                           //Inicializo la respuesta en false
                $user = auth()->user();
                $user = $this->searchUser($user->username, $user->password);
                $menues = $this->searchMenues($user->id);
                if ($user && $menues) {
                    $resp['message'] = 'Usuario y contraseña correctos';
                    $resp['data'] = ['user' => $user, 'menues' => $menues];                  //Devuelvo el usuario y el token
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();
            }
        }
        return $resp;
    }

    //Funcion que busca al usuario con $username y $password
    public function searchUser($username, $password)
    {
        $user = User::where(function ($query) use ($username) {
            $query->where('username', $username)
                ->orWhere('email', $username);
        })
            ->where('password', $password) // Verificar la contraseña
            ->join('roles_users AS rs', 'users.id', 'rs.user_id')                      //Busco el rol del usuario
            ->join('roles AS r', 'rs.role_id', 'r.id')                                 //Busco el nombre del rol
            ->leftJoin('url_data AS ud', 'users.url_data_id', 'ud.id')                     //Busco la foto del usuario
            ->select(
                'users.id AS id',
                'users.username AS username',
                'users.name AS name',
                'users.lastname AS lastname',
                'ud.url AS photoUser',
                'ud.id AS idPhotoUser',
                'users.email as email',
                DB::raw('GROUP_CONCAT(r.id SEPARATOR "#") AS roleIds'),
                DB::raw('GROUP_CONCAT(r.name SEPARATOR "#") AS roleNames')
            )
            ->groupBy('users.id', 'users.username', 'ud.id', 'users.email', 'users.name', 'users.lastname', 'ud.url')
            ->orderBy('r.rank', 'desc')
            ->first();
        return $user;
    }

    //Funcion que busca las rutas y menues de un usuario 
    public function searchMenues($idUser)
    {
        $menues = User::where('users.id', $idUser)
            ->join('roles_users AS rs', 'users.id', 'rs.user_id')
            ->join('roles AS r', 'rs.role_id', 'r.id')
            ->join('menues_rols AS mr', 'r.id', 'mr.rol_id')
            ->join('menues AS m', 'mr.menu_id', 'm.id')
            ->select(
                'r.name AS rolName',
                'r.icon AS icon',
                DB::raw('GROUP_CONCAT(CONCAT(m.route, "^", REPLACE(m.name, " ", "-")) SEPARATOR "#") AS routes'),
            )
            ->whereNull('mr.deleted_at')
            ->groupBy('rolName', 'icon')
            ->orderBy('rs.role_id', 'asc')
            ->get();
        return $menues;
    }

    /**
     * Funcion que registra al usuario
     * @param string $username
     * @param string $email
     * @param string $password
     * @return array
     */
    public function register()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                                   //Inicializo la respuesta en false
                $data = $resp['data'];                                           //Obtengo datos del json
                $data['username'] = str_replace(' ', '', $data['username']);           //Elimino los espacios en blanco
                $validator = Validator::make($data, [
                    'email' => 'required|unique:users,email',
                    'username' => 'required|unique:users,username',
                    'password' => 'required:users,password',
                ]);
                if ($validator->fails()) {                                             //Validamos que no exista el usuario
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();                              //Devuelvo el dato repetido
                } else {
                    $newUser = User::create([                                          //Inserto el usuario
                        'username' => $data['username'],
                        'name' => $data['name'],
                        'lastname' => $data['lastname'],
                        'email' => $data['email'],
                        'password' => $data['password']
                    ]);
                    $newUser->roles()->attach(1);                                     //Le doy por defecto el rol de "usuario"
                    unset($newUser->password);                                        //Borro la contraseña
                    $resp['data'] = $newUser;                                         //Devuelvo el id del usuario en caso de que se haya insertado correctamente
                    $resp['message'] = 'Usuario registrado correctamente';
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }
        return $resp;
    }

    /**
     * Funcion que modifica al usuario
     * @param string $username
     * @param string $email
     * @param string $password
     * @return array
     */
    public function updateUser(Request $request)
    {
        $resp = $this->verifyTokenForm($request);
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                                   //Inicializo la respuesta en false
                $data = $request->all();                                               //Obtengo datos del json
                $data['username'] = str_replace(' ', '', $data['username']);           //Elimino los espacios en blanco
                $validator = Validator::make($data, [
                    'email' => 'required|unique:users,email,' . $data['id'],
                    'username' => 'required|unique:users,username,' . $data['id'],
                    'lastname' => 'required',
                    'name' => 'required',
                ]);
                if ($validator->fails()) {                                             //Validamos que no exista el usuario
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();                              //Devuelvo el dato repetido
                } else {
                    $user = User::find($data['id']);
                    $respUpdate = $user->update([                                                 //Actualizo el usuario
                        'username' => $data['username'],
                        'name' => $data['name'],
                        'lastname' => $data['lastname'],
                        'email' => $data['email'],
                    ]);
                    if ($respUpdate && $request->hasFile('img')) {
                        $urlImg = $request->file('img')->store('/img/users', 'public');       //Guardamos la imagen enviada en la carpeta public/img

                        if (isset($user->urlData->url)) {
                            parent::deleteServImg($urlImg, $data['idUrlData']);   //Borro la imagen anterior
                        } else {
                            UrlData::create([
                                'url' => $urlImg,
                                'type' => 'imagen',
                                'section' => 'user',
                                'description' => 'Imagen de perfil del usuario ' . $user->username,

                            ]);
                            $user->update([
                                'url_data_id' => UrlData::latest()->first()->id,
                            ]);
                        }
                    }
                    // Actualizar la relación entre el usuario y el rol
                    $userUpdated = $this->searchUser($user->username, $user->password);
                    $resp['data'] = $userUpdated;                                         //Devuelvo el id del usuario en caso de que se haya insertado correctamente
                    $resp['message'] = 'Usuario actualizado correctamente';
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores 🥺🥺🥺🥺🥺
            }
        }
        return $resp;
    }

    /**
     * Funcion que recupera a todos los usuarios
     * @param string $password
     * @return array
     */
    public function getUsers()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $resp['data'] = User::offset(1)
                    ->limit(PHP_INT_MAX)
                    ->join('roles_users AS rs', 'users.id', 'rs.user_id')                      //Busco el rol del usuario
                    ->join('roles AS r', 'rs.role_id', 'r.id')                                 //Busco el nombre del rol
                    ->select(
                        'users.id AS id',
                        'username',
                        'users.name AS name',
                        'lastname',
                        'email',
                        DB::raw('GROUP_CONCAT(r.id SEPARATOR "#") AS roleIds'),
                        DB::raw('GROUP_CONCAT(r.name SEPARATOR "#") AS roleNames')
                    )
                    ->groupBy('users.id', 'username', 'email', 'users.name', 'lastname')
                    ->get();
                $resp['ok'] = true;
                $resp['message'] = 'Usuarios recuperados correctamente';
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }

        return $resp;
    }

    /**
     * Funcion que recupera a todos los usuarios
     * @param string $password
     * @return array
     */
    public function getInstruct()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;
                $resp['data'] = User::offset(1)
                    ->limit(PHP_INT_MAX)
                    ->join('roles_users AS rs', 'users.id', 'rs.user_id')                      //Busco el rol del usuario
                    ->join('roles AS r', 'rs.role_id', 'r.id')                                 //Busco el nombre del rol
                    ->where('r.id', 2)
                    ->where('users.deleted_at', null)
                    ->select(
                        'users.id AS id',
                        'username',
                        'users.name AS name',
                        'lastname',
                        'email',
                        DB::raw('GROUP_CONCAT(r.id SEPARATOR "#") AS roleIds'),
                        DB::raw('GROUP_CONCAT(r.name SEPARATOR "#") AS roleNames')
                    )
                    ->groupBy('users.id', 'username', 'email', 'users.name', 'lastname')
                    ->get();
                $resp['ok'] = true;
                $resp['message'] = 'Usuarios recuperados correctamente';
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();           //Devuelvo errores
            }
        }

        return $resp;
    }



    /**
     * Funcion que modifica al usuario
     * @param string $idUser
     * @return array
     */
    public function deleteUser()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                               //inicializao en false la respuesta
                $data = $resp['data'];
                $user = User::find($data['id']);                                   //buscamos al usuario por su id
                if ($user) {
                    $user->roles()->detach();
                    $user->delete();                                               //si lo encuentra lo eliminamos
                    $resp['data'] = $user;
                    $resp['message'] = 'Usuario eliminado correctamente';         //exito!!!!!! 😎
                    $resp['ok'] = true;
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();        //Devuelvo errores😊
            }
        }

        return $resp;
    }

    /**
     * Funcion que envia email para recuperar la contraseña
     * @param string $email
     * @return array
     */
    public function sendResetLinkEmail()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                               //inicializao en false la respuesta
                $data = $resp['data'];
                $validator = Validator::make($data, [
                    'email' => 'required',
                ]);
                if ($validator->fails()) {
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();
                } else {

                    $user = User::where('email', $data['email'])->first();             //buscamos al usuario por su email
                    if ($user) {
                        $token = Str::random(64);                                       //generamos un token
                        $issue = "Recuperar contraseña - Academia Manejar";             // Nombre de la persona que envia el formulario
                        $sendEmail = $user->email;                                    // Email a quien se envia el formulario
                        $userEmail = 'sugerencias@academiamanejar.com.ar';
                        $message  = "<html><body>";
                        $message .= "<h4>Hola " . $user->name . " " . $user->lastname . "</h4>";
                        $message .= "<p>Haz click en el siguiente link para recuperar tu contraseña:</p>";
                        $message .= "<a href='https://dev.academiamanejar.com.ar/reset-password/$token' target='_blank'>Recuperar la contraseña</a>";
                        // $message .= "<a href='https://academiamanejar.com.ar/reset-password/$token' target='_blank'>Recuperar la contraseña</a>";
                        $message .= "</body></html>";
                        // Mensaje que envia TOKEN
                        $header = "From:" . $userEmail . "\r\n";                        // Email de la persona
                        $header .= "Reply-To: " . $userEmail . "\r\n";                  // Email de la persona 
                        $header .= "Content-Type: text/html; charset=UTF-8 " . "\r\n";  // Asegurar que la codificación sea UTF-8
                        $header .= "X-Mailer: PHP/" . phpversion();                     // Version de PHP que se esta utilizando
                        $mail = @mail($sendEmail, $issue, $message, $header);           // Envio el email y guardo el resultado en una variable
                        if ($mail) {
                            ForgotPassword::create([                              //creamos el token
                                'token' => $token,
                                'email' => $user->email,
                                'used' => 0,
                            ]);
                            $resp['message'] = 'Email enviado correctamente!';         //exito!!!!!! 😎
                            $resp['ok'] = true;
                        } else {
                            $resp['message'] = 'Error al enviar el email!';
                        }
                    } else {
                        $resp['message'] = 'El Email no existe';
                    }
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();        //Devuelvo errores😊
            }
        }

        return $resp;
    }


    /**
     * Funcion que verifica si el token es correcto
     * @param string $email
     * @return array
     */
    public function tokenPass()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                               //inicializao en false la respuesta
                $data = $resp['data'];
                $validator = Validator::make($data, [
                    'token' => 'required',
                ]);
                if ($validator->fails()) {
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();
                } else {
                    $token = ForgotPassword::where('token', $data['token'])
                        ->where('used', 0)
                        ->where('created_at', '>', date('Y-m-d H:i:s', strtotime('-1 day')))
                        ->first();                                                    //buscamos si el token es correcto
                    $user = User::where('email', $token->email)->first();             //buscamos al usuario por su email
                    unset($user->password);                                           //Borro la contraseña
                    if ($user) {
                        $resp['message'] = 'Token correcto';
                        $resp['ok'] = true;
                        $resp['data'] = ['idUser' => $user['id'], 'idToken' => $token['id']];
                    } else {
                        $resp['message'] = 'Token incorrecto';
                    }
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();        //Devuelvo errores😊
            }
        }

        return $resp;
    }

    /**
     * Funcion que modifica la cotraseña
     * @param string $email
     * @return array
     */
    public function modifyPass()
    {
        $resp = $this->verifyToken();
        if ($resp['ok']) {
            try {
                $resp['ok'] = false;                                               //inicializao en false la respuesta
                $data = $resp['data'];
                $validator = Validator::make($data, [
                    'idUser' => 'required',
                    'idToken' => 'required',
                    'password' => 'required',
                ]);
                if ($validator->fails()) {
                    $errors = $validator->errors();
                    $resp['message'] = $errors->first();
                } else {
                    $user = User::where('id', $data['idUser'])->first();                //buscamos al usuario por su email
                    if ($user) {
                        $user->update([                                                 //Actualizo el usuario
                            'password' => $data['password'],
                        ]);
                        $token = ForgotPassword::where('id', $data['idToken'])
                            ->where('used', 0)
                            ->first();                                                   //buscamos si el token es correcto
                        $token->update([                                                 //Actualizo el usuario
                            'used' => 1,
                        ]);
                        $resp['message'] = 'Contraseña actualizada correctamente';
                        $resp['ok'] = true;
                    } else {
                        $resp['message'] = 'El usuario no existe';
                    }
                }
            } catch (\Exception $e) {
                $resp['message'] = 'Error en el servidor: ' . $e->getMessage();        //Devuelvo errores😊
            }
        }

        return $resp;
    }
}
