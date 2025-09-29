<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SubCategoryController extends Controller
{
    /**
     * Display a listing of sub-categories
     */
    public function index(Request $request): JsonResponse
    {
        $query = SubCategory::with('category');

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

        // Category filter
        if ($request->has('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $subCategories = $query->withCount(['questions', 'exams'])
                               ->orderBy('created_at', 'desc')
                               ->paginate($perPage);

        return response()->json([
            'data' => $subCategories->items(),
            'meta' => [
                'current_page' => $subCategories->currentPage(),
                'last_page' => $subCategories->lastPage(),
                'per_page' => $subCategories->perPage(),
                'total' => $subCategories->total(),
            ],
        ]);
    }

    /**
     * Store a newly created sub-category
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required|integer|exists:categories,id',
            'is_active' => 'boolean',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $subCategory = SubCategory::create($request->all());
        $subCategory->load('category');
        $subCategory->loadCount(['questions', 'exams']);

        return response()->json([
            'message' => 'Sub-category created successfully',
            'data' => $subCategory,
        ], 201);
    }

    /**
     * Display the specified sub-category
     */
    public function show(SubCategory $subCategory): JsonResponse
    {
        $subCategory->load('category');
        $subCategory->loadCount(['questions', 'exams']);
        
        return response()->json([
            'data' => $subCategory,
        ]);
    }

    /**
     * Update the specified sub-category
     */
    public function update(Request $request, SubCategory $subCategory): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required|integer|exists:categories,id',
            'is_active' => 'boolean',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $subCategory->update($request->all());
        $subCategory->load('category');
        $subCategory->loadCount(['questions', 'exams']);

        return response()->json([
            'message' => 'Sub-category updated successfully',
            'data' => $subCategory,
        ]);
    }

    /**
     * Remove the specified sub-category
     */
    public function destroy(SubCategory $subCategory): JsonResponse
    {
        // Check if sub-category has associated data
        if ($subCategory->questions()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete sub-category with questions',
            ], 422);
        }

        if ($subCategory->exams()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete sub-category with exams',
            ], 422);
        }

        $subCategory->delete();

        return response()->json([
            'message' => 'Sub-category deleted successfully',
        ]);
    }
}
