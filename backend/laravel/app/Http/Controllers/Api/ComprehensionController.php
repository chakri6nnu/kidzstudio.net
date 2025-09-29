<?php

namespace App\Http\Controllers\Api;

use App\Filters\ComprehensionFilters;
use App\Http\Controllers\Controller;
use App\Models\ComprehensionPassage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ComprehensionController extends Controller
{
    public function index(Request $request, ComprehensionFilters $filters): JsonResponse
    {
        $q = ComprehensionPassage::filter($filters)->orderByDesc('id');
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

    public function show(ComprehensionPassage $comprehension): JsonResponse
    {
        return response()->json(['data' => $comprehension->loadCount('questions')]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'passage' => 'required|string',
            'is_active' => 'boolean',
        ]);
        $c = ComprehensionPassage::create($data);
        return response()->json(['message' => 'Comprehension created', 'data' => $c], 201);
    }

    public function update(Request $request, ComprehensionPassage $comprehension): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'passage' => 'sometimes|required|string',
            'is_active' => 'boolean',
        ]);
        $comprehension->update($data);
        return response()->json(['message' => 'Comprehension updated', 'data' => $comprehension]);
    }

    public function destroy(ComprehensionPassage $comprehension): JsonResponse
    {
        $comprehension->secureDelete('questions');
        return response()->json(['message' => 'Comprehension deleted']);
    }
}


