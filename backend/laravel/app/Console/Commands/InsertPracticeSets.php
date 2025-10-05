<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PracticeSet;
use App\Models\SubCategory;
use App\Models\Category;
use App\Models\Section;
use App\Models\Skill;

class InsertPracticeSets extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'practicesets:insert {count=50}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Insert N practice sets directly into the database (default 50)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $count = (int) $this->argument('count');

        // Ensure we have a subcategory
        $subCategory = SubCategory::first();
        if (!$subCategory) {
            $category = Category::first();
            if (!$category) {
                $category = Category::create([
                    'name' => 'General',
                    'is_active' => 1,
                ]);
            }
            $subCategory = SubCategory::create([
                'name' => 'General Practice',
                'category_id' => $category->id,
                'is_active' => 1,
            ]);
        }

        // Ensure we have a skill
        $skill = Skill::first();
        if (!$skill) {
            $section = Section::first();
            if (!$section) {
                $section = Section::create([
                    'name' => 'General Section',
                    'is_active' => 1,
                ]);
            }
            $skill = Skill::create([
                'name' => 'General Skill',
                'section_id' => $section->id,
                'is_active' => 1,
            ]);
        }

        $topics = [
            'Arithmetic', 'Algebra', 'Geometry', 'Vocabulary', 'Reading',
            'Science', 'History', 'Geography', 'Computers', 'Logic'
        ];

        $created = 0;
        for ($i = 1; $i <= $count; $i++) {
            $title = $topics[($i - 1) % count($topics)] . ' Practice Set #' . $i;
            PracticeSet::create([
                'title' => $title,
                'sub_category_id' => $subCategory->id,
                'skill_id' => $skill->id,
                'description' => 'Inserted via console command',
                'total_questions' => 0,
                'auto_grading' => 1,
                'correct_marks' => 1,
                'allow_rewards' => 1,
                'settings' => [
                    'shuffle_questions' => true,
                    'shuffle_options' => true,
                ],
                'is_active' => 1,
            ]);
            $created++;
        }

        $this->info("Inserted {$created} practice sets.");
        return Command::SUCCESS;
    }
}



