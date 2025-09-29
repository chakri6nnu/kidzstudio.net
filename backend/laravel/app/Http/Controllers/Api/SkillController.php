<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
{
    /**
     * Display a listing of skills
     */
    public function index(Request $request): JsonResponse
    {
        $query = Skill::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Level filter
        if ($request->has('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        // Category filter
        if ($request->has('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $skills = $query->with(['category'])
                        ->withCount(['questions', 'exams'])
                        ->orderBy('created_at', 'desc')
                        ->paginate($perPage);

        return response()->json([
            'data' => $skills->items(),
            'meta' => [
                'current_page' => $skills->currentPage(),
                'last_page' => $skills->lastPage(),
                'per_page' => $skills->perPage(),
                'total' => $skills->total(),
            ],
        ]);
    }

    /**
     * Store a newly created skill
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:skills,name',
            'description' => 'nullable|string|max:1000',
            'level' => 'required|string|in:beginner,intermediate,advanced,expert',
            'category_id' => 'required|integer|exists:categories,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $skill = Skill::create($request->all());
        $skill->load(['category']);
        $skill->loadCount(['questions', 'exams']);

        return response()->json([
            'message' => 'Skill created successfully',
            'data' => $skill,
        ], 201);
    }

    /**
     * Display the specified skill
     */
    public function show(Skill $skill): JsonResponse
    {
        $skill->load(['category']);
        $skill->loadCount(['questions', 'exams']);
        
        return response()->json([
            'data' => $skill,
        ]);
    }

    /**
     * Update the specified skill
     */
    public function update(Request $request, Skill $skill): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:skills,name,' . $skill->id,
            'description' => 'nullable|string|max:1000',
            'level' => 'required|string|in:beginner,intermediate,advanced,expert',
            'category_id' => 'required|integer|exists:categories,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $skill->update($request->all());
        $skill->load(['category']);
        $skill->loadCount(['questions', 'exams']);

        return response()->json([
            'message' => 'Skill updated successfully',
            'data' => $skill,
        ]);
    }

    /**
     * Remove the specified skill
     */
    public function destroy(Skill $skill): JsonResponse
    {
        // Check if skill has associated data
        if ($skill->questions()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete skill with questions',
            ], 422);
        }

        if ($skill->exams()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete skill with exams',
            ], 422);
        }

        $skill->delete();

        return response()->json([
            'message' => 'Skill deleted successfully',
        ]);
    }
}
