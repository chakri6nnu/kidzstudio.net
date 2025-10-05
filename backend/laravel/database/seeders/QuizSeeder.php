<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Quiz;
use App\Models\QuizType;
use App\Models\SubCategory;
use App\Models\Category;
use Illuminate\Support\Str;

class QuizSeeder extends Seeder
{
    /**
     * Seed 50 quizzes with valid relations.
     */
    public function run(): void
    {
        $quizType = QuizType::where('slug', 'quiz')->where('is_active', 1)->first() ?? QuizType::first();
        if (!$quizType) {
            $quizType = QuizType::create([
                'name' => 'Quiz',
                'code' => 'qtp_'.Str::random(11),
                'slug' => 'quiz',
                'is_active' => 1,
            ]);
        }

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
                'name' => 'General Knowledge',
                'category_id' => $category->id,
                'is_active' => 1,
            ]);
        }

        $baseTitles = [
            'Math Basics', 'Science Facts', 'History Quick', 'Geography Quiz', 'English Grammar',
            'Computer Basics', 'Physics Intro', 'Chemistry Elements', 'Biology Cells', 'World Capitals',
        ];

        for ($i = 1; $i <= 50; $i++) {
            $title = $baseTitles[($i - 1) % count($baseTitles)] . ' #' . $i;
            Quiz::create([
                'title' => $title,
                'description' => 'Auto-seeded quiz ' . $i,
                'quiz_type_id' => $quizType->id,
                'sub_category_id' => $subCategory->id,
                'total_questions' => 0,
                'total_duration' => null,
                'total_marks' => null,
                'is_paid' => false,
                'price' => null,
                'can_redeem' => false,
                'points_required' => null,
                'is_private' => false,
                'is_active' => true,
                'settings' => [
                    'auto_duration' => true,
                    'auto_grading' => true,
                    'correct_marks' => 1,
                ],
            ]);
        }
    }
}



