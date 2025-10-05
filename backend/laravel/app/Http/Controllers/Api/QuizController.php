<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class QuizController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = Quiz::with(['subCategory:id,name', 'quizType:id,name'])
            ->orderByDesc('id');

        if ($s = $request->get('search')) {
            $q->where('title', 'like', "%$s%");
        }

        // filters
        if ($request->has('status') && $request->status !== 'all') {
            $status = strtolower($request->status);
            if (in_array($status, ['active', 'inactive'])) {
                $q->where('is_active', $status === 'active');
            } elseif ($status === 'paid') {
                $q->where('is_paid', true);
            } elseif ($status === 'private') {
                $q->where('is_private', true);
            }
        }

        if ($request->has('category') && $request->category !== 'all' && $request->category !== '') {
            $q->whereHas('subCategory', function ($sub) use ($request) {
                $sub->where('name', $request->category);
            });
        }

        // quiz type filtering (by id or name)
        if ($request->filled('quiz_type_id')) {
            $q->where('quiz_type_id', (int) $request->get('quiz_type_id'));
        } elseif ($request->filled('quiz_type')) {
            $typeName = $request->get('quiz_type');
            $q->whereHas('quizType', function ($t) use ($typeName) {
                $t->where('name', $typeName);
            });
        }

        $perPage = (int) ($request->get('limit', $request->get('per_page', 10)));
        $quizzes = $q->paginate($perPage);

        $counters = [
            'total_all' => \App\Models\Quiz::count(),
            'total_active' => \App\Models\Quiz::where('is_active', true)->count(),
            'total_paid' => \App\Models\Quiz::where('is_paid', true)->count(),
        ];

        return response()->json([
            'data' => $quizzes->items(),
            'meta' => [
                'current_page' => $quizzes->currentPage(),
                'last_page' => $quizzes->lastPage(),
                'per_page' => $quizzes->perPage(),
                'total' => $quizzes->total(),
                'counters' => $counters,
            ]
        ]);
    }

    public function show(Quiz $quiz): JsonResponse
    {
        return response()->json(['data' => $quiz->load(['subCategory','quizType','quizSchedules'])]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quiz_type_id' => 'required|exists:quiz_types,id',
            'sub_category_id' => 'required|exists:sub_categories,id',
            'total_marks' => 'nullable|numeric|min:0',
            'total_duration' => 'nullable|integer|min:0',
            'is_paid' => 'boolean',
            'price' => 'nullable|integer|min:0',
            'can_redeem' => 'boolean',
            'points_required' => 'nullable|integer|min:0',
            'is_private' => 'boolean',
            'is_active' => 'boolean',
            'settings' => 'nullable|array',
        ]);

        $quiz = Quiz::create($validated);
        return response()->json([
            'message' => 'Quiz created successfully',
            'data' => $quiz->load(['subCategory','quizType'])
        ], 201);
    }

    public function update(Request $request, Quiz $quiz): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'quiz_type_id' => 'sometimes|required|exists:quiz_types,id',
            'sub_category_id' => 'sometimes|required|exists:sub_categories,id',
            'total_marks' => 'nullable|numeric|min:0',
            'total_duration' => 'nullable|integer|min:0',
            'is_paid' => 'boolean',
            'price' => 'nullable|integer|min:0',
            'can_redeem' => 'boolean',
            'points_required' => 'nullable|integer|min:0',
            'is_private' => 'boolean',
            'is_active' => 'boolean',
            'settings' => 'nullable|array',
        ]);

        $quiz->update($validated);
        return response()->json([
            'message' => 'Quiz updated successfully',
            'data' => $quiz->load(['subCategory','quizType'])
        ]);
    }

    public function destroy(Quiz $quiz): JsonResponse
    {
        $quiz->delete();
        return response()->json(['message' => 'Quiz deleted successfully']);
    }
}


