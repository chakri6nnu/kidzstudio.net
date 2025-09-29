<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Topic;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TopicController extends Controller
{
    /**
     * Display a listing of topics
     */
    public function index(Request $request): JsonResponse
    {
        $query = Topic::query();

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

        // Skill filter
        if ($request->has('skill_id') && $request->skill_id !== 'all') {
            $query->where('skill_id', $request->skill_id);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $topics = $query->with(['category', 'skill'])
                        ->withCount(['questions', 'lessons'])
                        ->orderBy('created_at', 'desc')
                        ->paginate($perPage);

        return response()->json([
            'data' => $topics->items(),
            'meta' => [
                'current_page' => $topics->currentPage(),
                'last_page' => $topics->lastPage(),
                'per_page' => $topics->perPage(),
                'total' => $topics->total(),
            ],
        ]);
    }

    /**
     * Store a newly created topic
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:topics,name',
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required|integer|exists:categories,id',
            'skill_id' => 'nullable|integer|exists:skills,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'difficulty_level' => 'nullable|string|in:beginner,intermediate,advanced',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $topic = Topic::create($request->all());
        $topic->load(['category', 'skill']);
        $topic->loadCount(['questions', 'lessons']);

        return response()->json([
            'message' => 'Topic created successfully',
            'data' => $topic,
        ], 201);
    }

    /**
     * Display the specified topic
     */
    public function show(Topic $topic): JsonResponse
    {
        $topic->load(['category', 'skill']);
        $topic->loadCount(['questions', 'lessons']);
        
        return response()->json([
            'data' => $topic,
        ]);
    }

    /**
     * Update the specified topic
     */
    public function update(Request $request, Topic $topic): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:topics,name,' . $topic->id,
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required|integer|exists:categories,id',
            'skill_id' => 'nullable|integer|exists:skills,id',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'difficulty_level' => 'nullable|string|in:beginner,intermediate,advanced',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $topic->update($request->all());
        $topic->load(['category', 'skill']);
        $topic->loadCount(['questions', 'lessons']);

        return response()->json([
            'message' => 'Topic updated successfully',
            'data' => $topic,
        ]);
    }

    /**
     * Remove the specified topic
     */
    public function destroy(Topic $topic): JsonResponse
    {
        // Check if topic has associated data
        if ($topic->questions()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete topic with questions',
            ], 422);
        }

        if ($topic->lessons()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete topic with lessons',
            ], 422);
        }

        $topic->delete();

        return response()->json([
            'message' => 'Topic deleted successfully',
        ]);
    }
}
