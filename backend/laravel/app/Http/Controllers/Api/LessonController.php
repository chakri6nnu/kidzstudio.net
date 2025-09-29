<?php

namespace App\Http\Controllers\Api;

use App\Filters\LessonFilters;
use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index(Request $request, LessonFilters $filters): JsonResponse
    {
        $q = Lesson::with(['skill:id,name', 'topic:id,name', 'difficultyLevel:id,name'])
            ->filter($filters)
            ->orderByDesc('id');
        $p = $q->paginate($request->integer('per_page', 10));
        return response()->json([
            'data' => $p->items(),
            'meta' => [
                'current_page' => $p->currentPage(),
                'last_page' => $p->lastPage(),
                'per_page' => $p->perPage(),
                'total' => $p->total(),
            ],
        ]);
    }

    public function show(Lesson $lesson): JsonResponse
    {
        return response()->json(['data' => $lesson->load(['skill', 'topic', 'difficultyLevel'])]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'difficulty_level_id' => 'nullable|exists:difficulty_levels,id',
            'skill_id' => 'nullable|exists:skills,id',
            'topic_id' => 'nullable|exists:topics,id',
            'is_active' => 'boolean',
        ]);
        $lesson = Lesson::create($data);
        return response()->json(['message' => 'Lesson created', 'data' => $lesson], 201);
    }

    public function update(Request $request, Lesson $lesson): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'difficulty_level_id' => 'nullable|exists:difficulty_levels,id',
            'skill_id' => 'nullable|exists:skills,id',
            'topic_id' => 'nullable|exists:topics,id',
            'is_active' => 'boolean',
        ]);
        $lesson->update($data);
        return response()->json(['message' => 'Lesson updated', 'data' => $lesson]);
    }

    public function destroy(Lesson $lesson): JsonResponse
    {
        $lesson->delete();
        return response()->json(['message' => 'Lesson deleted']);
    }
}


