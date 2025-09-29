<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamType;
use App\Models\SubCategory;
use App\Models\QuestionType;
use App\Models\Question;
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

    public function questions(): JsonResponse
    {
        $query = Question::with(['questionType:id,name', 'topic:id,name', 'skill:id,name', 'difficultyLevel:id,name'])
            ->active();

        if ($code = request('code')) {
            $query->where('code', 'like', "%$code%");
        }
        if ($type = request('type')) {
            $query->whereHas('questionType', function ($q) use ($type) {
                $q->where('id', $type);
            });
        }
        if ($section = request('section')) {
            $query->whereHas('section', function ($q) use ($section) {
                $q->where('name', 'like', "%$section%");
            });
        }
        if ($skill = request('skill')) {
            $query->whereHas('skill', function ($q) use ($skill) {
                $q->where('name', 'like', "%$skill%");
            });
        }
        if ($topic = request('topic')) {
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
                $q->whereIn('slug', $levels)->orWhereIn('name', $levels);
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
