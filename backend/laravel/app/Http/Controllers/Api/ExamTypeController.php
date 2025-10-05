<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ExamTypeController extends Controller
{
    /**
     * Display a listing of exam types
     */
    public function index(Request $request): JsonResponse
    {
        $query = ExamType::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $examTypes = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $examTypes->items(),
            'meta' => [
                'current_page' => $examTypes->currentPage(),
                'last_page' => $examTypes->lastPage(),
                'per_page' => $examTypes->perPage(),
                'total' => $examTypes->total(),
            ],
        ]);
    }

    /**
     * Store a newly created exam type
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:exam_types,name',
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:20',
            'image_url' => 'nullable|string|max:500|url',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        $data['code'] = 'etp_' . substr(bin2hex(random_bytes(8)), 0, 12);
        
        $examType = ExamType::create($data);

        return response()->json([
            'message' => 'Exam type created successfully',
            'data' => $examType,
        ], 201);
    }

    /**
     * Display the specified exam type
     */
    public function show(ExamType $examType): JsonResponse
    {
        return response()->json([
            'data' => $examType,
        ]);
    }

    /**
     * Update the specified exam type
     */
    public function update(Request $request, ExamType $examType): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:exam_types,name,' . $examType->id,
            'description' => 'nullable|string|max:1000',
            'color' => 'nullable|string|max:20',
            'image_url' => 'nullable|string|max:500|url',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $examType->update($request->all());

        return response()->json([
            'message' => 'Exam type updated successfully',
            'data' => $examType,
        ]);
    }

    /**
     * Remove the specified exam type
     */
    public function destroy(ExamType $examType): JsonResponse
    {
        // Check if exam type has associated exams
        if ($examType->exams()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete exam type that is currently being used in exams',
            ], 422);
        }

        $examType->delete();

        return response()->json([
            'message' => 'Exam type deleted successfully',
        ]);
    }
}
