<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Exam;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'active_exams' => Exam::where('is_active', true)->count(),
            'total_quizzes' => Quiz::count(),
            'revenue' => 0,
        ];

        $recentExams = Exam::select('id','title as name','created_at')
            ->orderBy('id','desc')
            ->limit(10)
            ->get();

        $recentActivity = [];

        return response()->json([
            'stats' => $stats,
            'recent_exams' => $recentExams,
            'recent_activity' => $recentActivity,
        ]);
    }
}


