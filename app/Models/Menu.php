<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
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
        'name',
        'route',
    ];

    protected $table = 'menues';


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

    public function menues(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'menues_rols', 'menu_id', 'role_id');
    }
}
