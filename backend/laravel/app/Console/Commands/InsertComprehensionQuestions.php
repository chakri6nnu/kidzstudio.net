<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ComprehensionPassage;
use App\Models\Question;
use App\Models\QuestionType;
use App\Models\Skill;
use App\Models\Section;
use App\Models\Category;
use App\Models\SubCategory;

class InsertComprehensionQuestions extends Command
{
    protected $signature = 'comprehensions:questions {per=5}';
    protected $description = 'Generate N questions per comprehension passage and link them';

    public function handle(): int
    {
        $per = max(1, (int) $this->argument('per'));

        // Ensure skill exists for foreign key
        $skill = Skill::first();
        if (!$skill) {
            $section = Section::first() ?? Section::create(['name' => 'General Section', 'is_active' => 1]);
            $skill = Skill::create(['name' => 'General Skill', 'section_id' => $section->id, 'is_active' => 1]);
        }

        // Ensure subcategory exists (not required on questions, but useful to keep data consistent with practice)
        $subCategory = SubCategory::first();
        if (!$subCategory) {
            $category = Category::first() ?? Category::create(['name' => 'General', 'is_active' => 1]);
            $subCategory = SubCategory::create(['name' => 'General Practice', 'category_id' => $category->id, 'is_active' => 1]);
        }

        // Use MSA (Multiple Choice Single Answer) if available, else first active type
        $questionType = QuestionType::where('code', 'MSA')->first() ?? QuestionType::first();
        if (!$questionType) {
            $this->error('No question types found. Please seed question types first.');
            return Command::FAILURE;
        }

        $passages = ComprehensionPassage::query()->pluck('id');
        if ($passages->isEmpty()) {
            $this->warn('No comprehension passages found. Nothing to do.');
            return Command::SUCCESS;
        }

        $created = 0;
        foreach ($passages as $pid) {
            for ($i = 1; $i <= $per; $i++) {
                $options = ['A' => 'Option A', 'B' => 'Option B', 'C' => 'Option C', 'D' => 'Option D'];
                $correctKey = array_rand($options);

                Question::create([
                    'question_type_id' => $questionType->id,
                    'question' => 'Based on the passage, choose the best answer (' . $i . ').',
                    'options' => $options,
                    'correct_answer' => [$correctKey],
                    'default_marks' => 1,
                    'default_time' => 60,
                    'skill_id' => $skill->id,
                    'topic_id' => null,
                    'difficulty_level_id' => 1,
                    'preferences' => null,
                    'has_attachment' => 1,
                    'attachment_type' => 'comprehension',
                    'comprehension_passage_id' => $pid,
                    'attachment_options' => null,
                    'solution' => 'The correct choice is derived from key details in the passage.',
                    'solution_video' => null,
                    'hint' => 'Scan for keywords and main idea.',
                    'is_active' => 1,
                ]);
                $created++;
            }
        }

        $this->info("Created {$created} comprehension questions across {$passages->count()} passages (per={$per}).");
        return Command::SUCCESS;
    }
}



