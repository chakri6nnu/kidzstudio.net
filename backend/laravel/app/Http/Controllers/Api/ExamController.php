<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamType;
use App\Models\SubCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class ExamController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Exam::with(['subCategory:id,name', 'examType:id,name'])
            ->withCount(['examSections']);

        // Apply filters
        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->whereHas('subCategory', function($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        $exams = $query->orderBy('id', 'desc')->paginate($request->get('per_page', 10));

        return response()->json([
            'data' => $exams->items(),
            'meta' => [
                'current_page' => $exams->currentPage(),
                'last_page' => $exams->lastPage(),
                'per_page' => $exams->perPage(),
                'total' => $exams->total(),
            ]
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'exam_type_id' => 'required|exists:exam_types,id',
            'sub_category_id' => 'required|exists:sub_categories,id',
            'exam_mode' => 'sometimes|in:objective,subjective,mixed',
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
        if (!isset($validated['exam_mode'])) {
            $validated['exam_mode'] = 'objective';
        }

        $exam = Exam::create($validated);

        return response()->json([
            'message' => 'Exam created successfully',
            'data' => $exam->load(['subCategory', 'examType'])
        ], 201);
    }

    public function show(Exam $exam): JsonResponse
    {
        return response()->json([
            'data' => $exam->load(['subCategory', 'examType', 'examSections'])
        ]);
    }

    public function update(Request $request, Exam $exam): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'exam_type_id' => 'sometimes|required|exists:exam_types,id',
            'sub_category_id' => 'sometimes|required|exists:sub_categories,id',
            'exam_mode' => 'sometimes|in:objective,subjective,mixed',
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

        $exam->update($validated);

        return response()->json([
            'message' => 'Exam updated successfully',
            'data' => $exam->load(['subCategory', 'examType'])
        ]);
    }

    public function destroy(Exam $exam): JsonResponse
    {
        $exam->delete();

        return response()->json([
            'message' => 'Exam deleted successfully'
        ]);
    }
}
