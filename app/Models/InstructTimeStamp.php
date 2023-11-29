<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InstructTimeStamp extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_instruct_id',
        'car_m_id',
        'car_t_id',
        'time_start',
        'time_end',
        'deleted_at',
    ];

    protected $table = 'instruct_timestamp';


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function userInstruct()
    {
        return $this->hasOne(User::class, 'id', 'user_instruct_id');
    }
}
