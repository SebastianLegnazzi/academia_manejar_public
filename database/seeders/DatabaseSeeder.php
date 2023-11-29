<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Calendar;
use App\Models\Debt;
use App\Models\MenuRol;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(QuestionExamSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(UrlDataSeeder::class);
        $this->call(CourseSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(CommentAnswerSeeder::class);
        $this->call(MenuSeeder::class);
        $this->call(MenuRolSeeder::class);
        $this->call(CalendarSeeder::class);
        $this->call(CarSeeder::class);
        $this->call(ExamSeeder::class);
        $this->call(InstructTimestampSeeder::class);
        $this->call(TurnSeeder::class);
        $this->call(ReviewSeeder::class);
        $this->call(DebtSeeder::class);
        $this->call(PaymentSeeder::class);
        $this->call(ResultExamSeeder::class);
    }
}
