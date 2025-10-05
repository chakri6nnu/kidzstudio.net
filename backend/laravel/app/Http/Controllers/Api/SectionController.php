<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SectionController extends Controller
{
    /**
     * Display a listing of sections
     */
    public function index(Request $request): JsonResponse
    {
        $query = Section::query();

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


        // Pagination
        $perPage = $request->get('per_page', 15);
        $sections = $query->withCount(['questions', 'exams'])
                          ->orderBy('created_at', 'desc')
                          ->paginate($perPage);

        return response()->json([
            'data' => $sections->items(),
            'meta' => [
                'current_page' => $sections->currentPage(),
                'last_page' => $sections->lastPage(),
                'per_page' => $sections->perPage(),
                'total' => $sections->total(),
            ],
        ]);
    }

    /**
     * Store a newly created section
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:sections,name',
            'short_description' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $section = Section::create($request->all());
        $section->loadCount(['questions', 'exams']);

        return response()->json([
            'message' => 'Section created successfully',
            'data' => $section,
        ], 201);
    }

    /**
     * Display the specified section
     */
    public function show(Section $section): JsonResponse
    {
        $section->loadCount(['questions', 'exams']);
        
        return response()->json([
            'data' => $section,
        ]);
    }

    /**
     * Update the specified section
     */
    public function update(Request $request, Section $section): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:sections,name,' . $section->id,
            'short_description' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $section->update($request->all());
        $section->loadCount(['questions', 'exams']);

        return response()->json([
            'message' => 'Section updated successfully',
            'data' => $section,
        ]);
    }

    /**
     * Remove the specified section
     */
    public function destroy(Section $section): JsonResponse
    {
        // Check if section has associated data
        if ($section->questions()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete section with questions',
            ], 422);
        }

        if ($section->exams()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete section with exams',
            ], 422);
        }

        $section->delete();

        return response()->json([
            'message' => 'Section deleted successfully',
        ]);
    }
}
