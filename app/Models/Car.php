<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'model',
        'url_data_id',
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

    /**
     * Get the url data associated with the car.
     */
    public function urlData()
    {
        return $this->hasOne(UrlData::class, 'id', 'url_data_id');
    }

    /**
     * Get the instruct time stamp associated with the car.
     */
    public function instructTimeStampM()
    {
        return $this->hasOne(InstructTimeStamp::class, 'car_m_id', 'id');
    }
    /**
     * Get the instruct time stamp associated with the car.
     */
    public function instructTimeStampT()
    {
        return $this->hasOne(InstructTimeStamp::class, 'car_t_id', 'id');
    }
}
