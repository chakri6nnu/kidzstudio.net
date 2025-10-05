<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizQuestionController extends Controller
{
    public function index(Quiz $quiz): JsonResponse
    {
        $questions = $quiz->questions()->select('questions.id', 'questions.code')->paginate(request('per_page', 10));
        return response()->json($questions);
    }

    public function store(Request $request, Quiz $quiz): JsonResponse
    {
        $data = $request->validate([
            'question_ids' => ['required', 'array'],
            'question_ids.*' => ['exists:questions,id']
        ]);
        $quiz->questions()->syncWithoutDetaching($data['question_ids']);
        return response()->json(['message' => 'Questions added']);
    }

    public function destroy(Quiz $quiz, Question $question): JsonResponse
    {
        $quiz->questions()->detach($question->id);
        return response()->json(['message' => 'Question removed']);
    }
}


