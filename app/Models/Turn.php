<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;


class Turn extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'date_turn_ini',
        'date_turn_end',
        'car_id',
        'courses_id',
        'user_alumn_id',
        'review_id',
        'user_payment_id',
        'instruct_timestamp_id',
    ];

    protected $table = 'turn';

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


    public function instructTimestamp()
    {
        return $this->HasOne(InstructTimeStamp::class, 'id', 'instruct_timestamp_id');
    }

    public function course(): HasOne
    {
        return $this->HasOne(Course::class, 'id', 'courses_id');
    }

    public function userAlumn(): HasOne
    {
        return $this->HasOne(User::class, 'id', 'user_alumn_id');
    }

    public function debts()
    {
        return $this->hasMany(Debt::class, 'turns_id', 'id');
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class, 'id', 'review_id');
    }


}
