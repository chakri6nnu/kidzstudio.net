<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\QuestionType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionTypeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $q = QuestionType::query()->orderBy('name');
        if ($s = $request->get('search')) {
            $q->where('name', 'like', "%$s%")->orWhere('code', 'like', "%$s%");
        }
		$p = $q->paginate((int) $request->get('per_page', 10));
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

    public function show(QuestionType $questionType): JsonResponse
    {
        return response()->json(['data' => $questionType]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:question_types,code',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $qt = QuestionType::create($data);
        return response()->json(['message' => 'Question type created', 'data' => $qt], 201);
    }

    public function update(Request $request, QuestionType $questionType): JsonResponse
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:20|unique:question_types,code,' . $questionType->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
        $questionType->update($data);
        return response()->json(['message' => 'Question type updated', 'data' => $questionType]);
    }

    public function destroy(QuestionType $questionType): JsonResponse
    {
        $questionType->delete();
        return response()->json(['message' => 'Question type deleted']);
    }
}


