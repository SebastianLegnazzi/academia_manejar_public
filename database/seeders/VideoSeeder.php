<?php

namespace Database\Seeders;

use App\Models\Video;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //======== ID 1 ======== 
        Video::create([
            "urlvideo" => "https://www.youtube.com/watch?v=StN2dGL6lFk",
            "title" => "Video 1",
        ]);
        //======== ID 2 ======== 
        Video::create([
            "urlvideo" => "https://www.youtube.com/watch?v=sQjWhnrG81U",
            "title" => "Video 2",
        ]);
        //======== ID 3 ======== 
        Video::create([
            "urlvideo" => "https://www.youtube.com/watch?v=KykFMMCjzos&embeds_referring_euri=http%3A%2F%2Flocalhost%3A3000%2F&embeds_referring_origin=http%3A%2F%2Flocalhost%3A3000",
            "title" => "Video 3",
        ]);
    }
}
