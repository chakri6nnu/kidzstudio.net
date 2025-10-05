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
            ->withCount(['examSections', 'sessions', 'examSchedules']);

        // Apply filters
        if ($request->has('search') && $request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status') && $request->status !== 'all') {
            $status = strtolower($request->status);
            // map known status flags to actual columns
            if (in_array($status, ['active', 'inactive'])) {
                $query->where('is_active', $status === 'active');
            } elseif ($status === 'paid') {
                $query->where('is_paid', true);
            } elseif ($status === 'private') {
                $query->where('is_private', true);
            } else {
                // fallback: try a strict match on a status column only if it exists
                // but avoid SQL error when no such column; ignore unknown values
            }
        }

        if ($request->has('category') && $request->category !== 'all' && $request->category !== '') {
            $query->whereHas('subCategory', function($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        // support both limit and per_page query params
        $perPage = $request->get('limit', $request->get('per_page', 10));
        $exams = $query->orderBy('id', 'desc')->paginate($perPage);

        // Global counters for dashboard cards
        $counters = [
            'total_all' => \App\Models\Exam::count(),
            'total_active' => \App\Models\Exam::where('is_active', true)->count(),
            'total_paid' => \App\Models\Exam::where('is_paid', true)->count(),
        ];

        return response()->json([
            'data' => $exams->items(),
            'meta' => [
                'current_page' => $exams->currentPage(),
                'last_page' => $exams->lastPage(),
                'per_page' => $exams->perPage(),
                'total' => $exams->total(),
                'counters' => $counters,
            ]
        ]);
    }

    public function sections(Exam $exam): JsonResponse
    {
        $sections = $exam->examSections()
            ->with(['section:id,name'])
            ->orderBy('section_order')
            ->get();

        return response()->json([
            'data' => $sections->map(function ($section) {
                return [
                    'id' => $section->id,
                    'display_name' => $section->name,
                    'section' => $section->section->name ?? '',
                    'section_id' => $section->section_id,
                    'section_order' => $section->section_order,
                    'duration' => $section->total_duration / 60, // Convert to minutes
                    'marks_for_correct_answer' => $section->correct_marks,
                    'total_questions' => $section->total_questions,
                    'total_duration' => $section->total_duration / 60, // Convert to minutes
                    'total_marks' => $section->total_marks,
                ];
            })
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
