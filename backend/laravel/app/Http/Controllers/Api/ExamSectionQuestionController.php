<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSection;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExamSectionQuestionController extends Controller
{
    public function index(Exam $exam, ExamSection $section): JsonResponse
    {
        $this->authorizeSection($exam, $section);
        $questions = $section->questions()->select('questions.id','questions.code')->paginate(request('per_page', 10));
        return response()->json($questions);
    }

    public function store(Request $request, Exam $exam, ExamSection $section): JsonResponse
    {
        $this->authorizeSection($exam, $section);
        $data = $request->validate([ 'question_ids' => 'required|array', 'question_ids.*' => 'exists:questions,id' ]);
        // Include exam_id on the pivot to satisfy exam_questions schema
        $attachPayload = collect($data['question_ids'])
            ->mapWithKeys(function ($questionId) use ($exam) {
                return [ (int) $questionId => ['exam_id' => $exam->id] ];
            })
            ->all();

        $section->questions()->syncWithoutDetaching($attachPayload);
        return response()->json(['message' => 'Questions added']);
    }

    public function destroy(Exam $exam, ExamSection $section, Question $question): JsonResponse
    {
        $this->authorizeSection($exam, $section);
        $section->questions()->detach($question->id);
        return response()->json(['message' => 'Question removed']);
    }

    private function authorizeSection(Exam $exam, ExamSection $section): void
    {
        if ($section->exam_id !== $exam->id) {
            abort(404);
        }
    }
}


