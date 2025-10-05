<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuizType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizTypeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = QuizType::query()->orderBy('name');
        if ($s = $request->get('search')) {
            $q->where('name', 'like', "%$s%")->orWhere('code', 'like', "%$s%");
        }
		$items = $q->paginate((int) $request->get('per_page', 10));
        return response()->json([
            'data' => $items->items(),
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function show(QuizType $quizType): JsonResponse
    {
        return response()->json(['data' => $quizType]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);
        $data['code'] = 'qtp_'.substr(bin2hex(random_bytes(8)), 0, 12);
        $quizType = QuizType::create($data);
        return response()->json(['message' => 'Quiz type created', 'data' => $quizType], 201);
    }

    public function update(Request $request, QuizType $quizType): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);
        $quizType->update($data);
        return response()->json(['message' => 'Quiz type updated', 'data' => $quizType]);
    }

    public function destroy(QuizType $quizType): JsonResponse
    {
        $quizType->delete();
        return response()->json(['message' => 'Quiz type deleted']);
    }
}


