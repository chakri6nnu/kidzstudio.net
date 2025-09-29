<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TagController extends Controller
{
    /**
     * Display a listing of tags
     */
    public function index(Request $request): JsonResponse
    {
        $query = Tag::query();

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

        // Color filter
        if ($request->has('color') && $request->color !== 'all') {
            $query->where('color', $request->color);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $tags = $query->withCount(['questions', 'exams'])
                      ->orderBy('created_at', 'desc')
                      ->paginate($perPage);

        return response()->json([
            'data' => $tags->items(),
            'meta' => [
                'current_page' => $tags->currentPage(),
                'last_page' => $tags->lastPage(),
                'per_page' => $tags->perPage(),
                'total' => $tags->total(),
            ],
        ]);
    }

    /**
     * Store a newly created tag
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tags,name',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:7',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $tag = Tag::create($request->all());
        $tag->loadCount(['questions', 'exams']);

        return response()->json([
            'message' => 'Tag created successfully',
            'data' => $tag,
        ], 201);
    }

    /**
     * Display the specified tag
     */
    public function show(Tag $tag): JsonResponse
    {
        $tag->loadCount(['questions', 'exams']);
        
        return response()->json([
            'data' => $tag,
        ]);
    }

    /**
     * Update the specified tag
     */
    public function update(Request $request, Tag $tag): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:7',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $tag->update($request->all());
        $tag->loadCount(['questions', 'exams']);

        return response()->json([
            'message' => 'Tag updated successfully',
            'data' => $tag,
        ]);
    }

    /**
     * Remove the specified tag
     */
    public function destroy(Tag $tag): JsonResponse
    {
        // Check if tag has associated data
        if ($tag->questions()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete tag with questions',
            ], 422);
        }

        if ($tag->exams()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete tag with exams',
            ], 422);
        }

        $tag->delete();

        return response()->json([
            'message' => 'Tag deleted successfully',
        ]);
    }
}
