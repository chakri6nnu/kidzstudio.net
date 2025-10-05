<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PracticeSet;
use Illuminate\Http\Request;

class PracticeSetController extends Controller
{
    public function index(Request $request)
    {
        $query = PracticeSet::with([
                'skill:id,name',
                'subCategory:id,name',
                'questions:id,difficulty_level_id',
                'questions.difficultyLevel:id,name'
            ])->withCount(['questions', 'sessions']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($status = $request->get('status')) {
            if ($status === 'active' || $status === 'Published') {
                $query->where('is_active', 1);
            } elseif ($status === 'inactive' || $status === 'Draft') {
                $query->where('is_active', 0);
            }
        }

        $perPage = (int) ($request->get('limit', 10));
        $paginator = $query->orderByDesc('id')->paginate($perPage);

        $items = collect($paginator->items())->map(function (PracticeSet $set) {
            // Determine difficulty from attached questions' difficulty levels
            $difficulty = null;
            if ($set->relationLoaded('questions')) {
                $names = collect($set->questions)
                    ->map(function ($q) {
                        return optional($q->difficultyLevel)->name;
                    })
                    ->filter()
                    ->values();
                if ($names->count() > 0) {
                    $unique = $names->unique();
                    if ($unique->count() === 1) {
                        $difficulty = $unique->first();
                    } else {
                        $difficulty = 'Mixed';
                    }
                }
            }
            return [
                'id' => $set->id,
                'title' => $set->title,
                'description' => $set->description,
                'skill' => optional($set->skill)->name,
                'subCategory' => optional($set->subCategory)->name,
                'difficulty' => $difficulty,
                'questions' => $set->questions_count ?? ($set->total_questions ?? 0),
                'lessons' => 0,
                'videos' => 0,
                'completions' => $set->sessions_count ?? 0,
                'averageScore' => null,
                'estimatedTime' => $set->settings['estimated_time'] ?? null,
                'adaptiveMode' => (bool) ($set->auto_grading ?? false),
                'status' => $set->is_active ? 'Published' : 'Draft',
            ];
        })->all();

        return response()->json([
            'data' => $items,
            'total' => $paginator->total(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
        ]);
    }

    public function show(PracticeSet $practiceSet)
    {
        return response()->json($practiceSet);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sub_category_id' => 'required|integer',
            'skill_id' => 'required|integer',
            'is_active' => 'boolean',
        ]);

        $practiceSet = PracticeSet::create($validated);
        return response()->json($practiceSet, 201);
    }

    public function update(Request $request, PracticeSet $practiceSet)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'sub_category_id' => 'sometimes|required|integer',
            'skill_id' => 'sometimes|required|integer',
            'is_active' => 'boolean',
            'is_paid' => 'boolean',
            'price' => 'nullable|numeric|min:0',
            'correct_marks' => 'nullable|integer|min:0',
            'settings' => 'nullable|array',
        ]);

        $practiceSet->fill(collect($validated)->except('settings')->toArray());

        if ($request->has('settings') && is_array($request->input('settings'))) {
            $practiceSet->settings = array_merge($practiceSet->settings ?? [], $request->input('settings'));
        }

        $practiceSet->save();
        return response()->json($practiceSet->fresh());
    }

    public function destroy(PracticeSet $practiceSet)
    {
        $practiceSet->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function questions(PracticeSet $practiceSet, Request $request)
    {
        $perPage = (int) ($request->get('per_page', 50));
        $data = $practiceSet->questions()->with(['difficultyLevel:id,name', 'questionType:id,name'])->paginate($perPage);
        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'last_page' => $data->lastPage(),
        ]);
    }

    public function addQuestions(PracticeSet $practiceSet, Request $request)
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids)) {
            return response()->json(['message' => 'ids must be an array'], 422);
        }
        $practiceSet->questions()->syncWithoutDetaching($ids);
        return response()->json(['message' => 'Questions added']);
    }

    public function removeQuestion(PracticeSet $practiceSet, $questionId)
    {
        $practiceSet->questions()->detach([$questionId]);
        return response()->json(['message' => 'Question removed']);
    }
}


