<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Debt extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'concept',
        'total_debt',
        'saldo',
        'turns_id',
        'deleted_at',
    ];

    //use SoftDeletes;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'created_at',
        'updated_at',
        
    ];

    public function turns()
    {
        return $this->hasOne(Turn::class, 'id', 'turns_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'debts_id', 'id');
    }
}
