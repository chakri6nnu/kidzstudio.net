<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Imports\QuestionsImport;
use App\Models\DifficultyLevel;
use App\Models\QuestionType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class QuestionImportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'file' => 'required|file|mimes:xlsx,csv,xls',
            'skill_id' => 'required|exists:skills,id',
        ]);

        $questionTypes = QuestionType::pluck('id', 'code')->toArray();
        $difficultyLevels = DifficultyLevel::pluck('id', 'code')->toArray();

        $import = new QuestionsImport($questionTypes, $difficultyLevels, $data['skill_id']);
        Excel::import($import, $data['file']);

        return response()->json([
            'message' => 'Questions import started',
            'rows' => method_exists($import, 'getRowCount') ? $import->getRowCount() : null,
        ]);
    }
}


