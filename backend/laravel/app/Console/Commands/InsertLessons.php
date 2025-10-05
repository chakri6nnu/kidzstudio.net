<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Lesson;
use App\Models\Skill;
use App\Models\Section;
use App\Models\SubCategory;
use App\Models\Category;

class InsertLessons extends Command
{
    protected $signature = 'lessons:insert {count=50}';
    protected $description = 'Insert N lessons and attach to practice via pivots (default 50)';

    public function handle(): int
    {
        $count = (int) $this->argument('count');

        // Ensure basics
        $subCategory = SubCategory::first();
        if (!$subCategory) {
            $category = Category::first() ?? Category::create(['name' => 'General', 'is_active' => 1]);
            $subCategory = SubCategory::create(['name' => 'General Practice', 'category_id' => $category->id, 'is_active' => 1]);
        }

        $skill = Skill::first();
        if (!$skill) {
            $section = Section::first() ?? Section::create(['name' => 'General Section', 'is_active' => 1]);
            $skill = Skill::create(['name' => 'General Skill', 'section_id' => $section->id, 'is_active' => 1]);
        }

        $topics = ['Intro', 'Basics', 'Practice', 'Advanced', 'Review'];
        $created = 0;
        for ($i = 1; $i <= $count; $i++) {
            $title = $topics[($i - 1) % count($topics)] . ' Lesson #' . $i;
            $lesson = Lesson::create([
                'title' => $title,
                'body' => 'Auto-generated lesson content ' . $i,
                'duration' => 5,
                'skill_id' => $skill->id,
                'is_paid' => 0,
                'is_active' => 1,
            ]);

            // attach to practice via pivot (sub_category, skill, lesson)
            \DB::table('practice_lessons')->updateOrInsert([
                'lesson_id' => $lesson->id,
                'skill_id' => $skill->id,
                'sub_category_id' => $subCategory->id,
            ], [
                'sort_order' => $i,
            ]);

            $created++;
        }

        $this->info("Inserted {$created} lessons and attached to practice.");
        return Command::SUCCESS;
    }
}



