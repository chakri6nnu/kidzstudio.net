<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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
                  ->orWhere('short_description', 'like', '%' . $request->search . '%');
            });
        }

        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Section filter
        if ($request->has('section_id') && $request->section_id !== 'all') {
            $query->where('section_id', $request->section_id);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $skills = $query->with(['section'])
                        ->withCount(['questions'])
                        ->orderBy('created_at', 'desc')
                        ->paginate($perPage);

        // Add exams_count manually for each skill
        $skills->getCollection()->transform(function ($skill) {
            $skill->exams_count = 0; // Set default value
            return $skill;
        });

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
            'short_description' => 'nullable|string|max:255',
            'section_id' => 'required|integer|exists:sections,id',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $skill = Skill::create($request->all());
        $skill->load(['section']);
        $skill->loadCount(['questions']);
        $skill->exams_count = 0; // Set default value

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
        $skill->load(['section']);
        $skill->loadCount(['questions']);
        $skill->exams_count = 0; // Set default value
        
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
            'short_description' => 'nullable|string|max:255',
            'section_id' => 'required|integer|exists:sections,id',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $skill->update($request->all());
        $skill->load(['section']);
        $skill->loadCount(['questions']);
        $skill->exams_count = 0; // Set default value

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

        $hasExams = \App\Models\Exam::whereHas('questions', function ($q) use ($skill) {
            $q->where('skill_id', $skill->id);
        })->exists();

        if ($hasExams) {
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
