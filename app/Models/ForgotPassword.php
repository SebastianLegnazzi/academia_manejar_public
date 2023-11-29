<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForgotPassword extends Model
{
    use HasFactory;
    /**
     * Tabla que guarda los token generados para recuperar contraseñas
     * type:0 = Sin usar
     * type:1 = Usado
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'token',
        'email',
        'used',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}
