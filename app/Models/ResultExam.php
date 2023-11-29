<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultExam extends Model
{
    use HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_alumn_id',
        'exam_id',
        'time_exam',
        'correct',
        'incorrect',
        'result',
        'min_approved',
    ];

    protected $table = 'result_exam';


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

    public function user()
    {
        return $this->HasOne(User::class, 'id', 'user_alumn_id');
    }

    public function exam()
    {
        return $this->HasOne(Exam::class, 'id', 'exam_id');
    }
}
