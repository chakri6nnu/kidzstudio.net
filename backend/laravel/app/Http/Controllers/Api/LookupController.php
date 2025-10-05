<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamType;
use App\Models\SubCategory;
use App\Models\QuestionType;
use App\Models\Question;
use App\Models\DifficultyLevel;
use Illuminate\Http\JsonResponse;

class LookupController extends Controller
{
    public function examTypes(): JsonResponse
    {
        $items = ExamType::select('id', 'name')->where('is_active', true)->orderBy('name')->get();
        return response()->json(['data' => $items]);
    }

    public function subCategories(): JsonResponse
    {
        $items = SubCategory::select('id', 'name')->where('is_active', true)->orderBy('name')->get();
        return response()->json(['data' => $items]);
    }

    public function questionTypes(): JsonResponse
    {
        $items = QuestionType::select('id', 'name')->where('is_active', true)->orderBy('name')->get();
        return response()->json(['data' => $items]);
    }

    public function difficultyLevels(): JsonResponse
    {
        $items = DifficultyLevel::select('id', 'name', 'code')
            ->active()
            ->orderBy('name')
            ->get();
        return response()->json(['data' => $items]);
    }

    public function questions(): JsonResponse
    {
        $query = Question::with(['questionType:id,name', 'topic:id,name', 'skill:id,name', 'difficultyLevel:id,name']);

        // Status filter: default active unless explicitly set to all or inactive
        $status = request('status');
        if ($status === 'inactive') {
            $query->where('is_active', false);
        } elseif ($status === 'all') {
            // no status constraint
        } else {
            $query->where('is_active', true);
        }

        if ($code = request('code')) {
            $query->where('code', 'like', "%$code%");
        }
        // Support single type or legacy array question_types[]
        $types = request('question_types');
        if ($types !== null) {
            $typeValues = is_array($types) ? $types : [$types];
            $numeric = array_filter($typeValues, fn($v) => is_numeric($v));
            $strings = array_diff($typeValues, $numeric);
            if (!empty($numeric)) {
                $query->whereIn('question_type_id', array_map('intval', $numeric));
            }
            if (!empty($strings)) {
                $query->whereHas('questionType', function ($q) use ($strings) {
                    $q->where(function ($qq) use ($strings) {
                        $qq->whereIn('name', $strings)
                           ->orWhereIn('code', $strings);
                    });
                });
            }
        } elseif ($type = request('type')) {
            if (is_numeric($type)) {
                $query->where('question_type_id', (int) $type);
            } else {
                $query->whereHas('questionType', function ($q) use ($type) {
                    $q->where('name', 'like', "%$type%")
                      ->orWhere('code', 'like', "%$type%");
                });
            }
        }
        // Exact ID filters if provided, else fallback to fuzzy name filters
        if ($sectionId = request('section_id')) {
            $query->whereHas('section', function ($q) use ($sectionId) {
                $q->where('sections.id', (int) $sectionId);
            });
        } elseif ($section = request('section')) {
            $query->whereHas('section', function ($q) use ($section) {
                $q->where('name', 'like', "%$section%");
            });
        }

        if ($skillId = request('skill_id')) {
            $query->where('skill_id', (int) $skillId);
        } elseif ($skill = request('skill')) {
            $query->whereHas('skill', function ($q) use ($skill) {
                $q->where('name', 'like', "%$skill%");
            });
        }

        if ($topicId = request('topic_id')) {
            $query->where('topic_id', (int) $topicId);
        } elseif ($topic = request('topic')) {
            $query->whereHas('topic', function ($q) use ($topic) {
                $q->where('name', 'like', "%$topic%");
            });
        }
        if ($tag = request('byTag')) {
            $query->whereHas('tags', function ($q) use ($tag) {
                $q->where('name', 'like', "%$tag%");
            });
        }
        if ($difficulty = request('difficulty')) {
            $levels = is_array($difficulty) ? $difficulty : explode(',', $difficulty);
            $query->whereHas('difficultyLevel', function ($q) use ($levels) {
                $q->whereIn('code', $levels)->orWhereIn('name', $levels);
            });
        }

        $perPage = (int) request('per_page', 10);
        $p = $query->orderBy('id', 'desc')->paginate($perPage);
        return response()->json([
            'data' => $p->items(),
            'meta' => [
                'current_page' => $p->currentPage(),
                'last_page' => $p->lastPage(),
                'per_page' => $p->perPage(),
                'total' => $p->total(),
            ],
        ]);
    }
}
