<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Exam;
use App\Models\Quiz;
use App\Models\PracticeSet;
use App\Models\ExamSession;
use App\Models\QuizSession;
use App\Models\PracticeSession;

class StudentController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();
        
        // Get recent activity
        $recentExamSessions = $user->examSessions()
            ->with('exam')
            ->latest()
            ->limit(5)
            ->get();
            
        $recentQuizSessions = $user->quizSessions()
            ->with('quiz')
            ->latest()
            ->limit(5)
            ->get();
            
        $recentPracticeSessions = $user->practiceSessions()
            ->with('practiceSet')
            ->latest()
            ->limit(5)
            ->get();

        // Get statistics
        $totalExams = $user->examSessions()->count();
        $totalQuizzes = $user->quizSessions()->count();
        $totalPracticeSessions = $user->practiceSessions()->count();
        
        $completedExams = $user->examSessions()->where('status', 'completed')->count();
        $completedQuizzes = $user->quizSessions()->where('status', 'completed')->count();
        $completedPracticeSessions = $user->practiceSessions()->where('status', 'completed')->count();

        return response()->json([
            'stats' => [
                'total_exams' => $totalExams,
                'total_quizzes' => $totalQuizzes,
                'total_practice_sessions' => $totalPracticeSessions,
                'completed_exams' => $completedExams,
                'completed_quizzes' => $completedQuizzes,
                'completed_practice_sessions' => $completedPracticeSessions,
            ],
            'recent_activity' => [
                'exam_sessions' => $recentExamSessions,
                'quiz_sessions' => $recentQuizSessions,
                'practice_sessions' => $recentPracticeSessions,
            ]
        ]);
    }

    public function exams(Request $request)
    {
        $exams = Exam::where('is_active', true)
            ->where('is_private', false)
            ->with(['examType', 'subCategory'])
            ->paginate(20);

        return response()->json($exams);
    }

    public function quizzes(Request $request)
    {
        $quizzes = Quiz::where('is_active', true)
            ->where('is_private', false)
            ->with(['quizType', 'subCategory'])
            ->paginate(20);

        return response()->json($quizzes);
    }

    public function practiceSets(Request $request)
    {
        $practiceSets = PracticeSet::where('is_active', true)
            ->where('is_private', false)
            ->with(['subCategory'])
            ->paginate(20);

        return response()->json($practiceSets);
    }

    public function progress(Request $request)
    {
        $user = $request->user();
        
        // Get progress data
        $examProgress = $user->examSessions()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();
            
        $quizProgress = $user->quizSessions()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();
            
        $practiceProgress = $user->practiceSessions()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        return response()->json([
            'exam_progress' => $examProgress,
            'quiz_progress' => $quizProgress,
            'practice_progress' => $practiceProgress,
        ]);
    }

    public function examSessions(Request $request)
    {
        $user = $request->user();
        
        $sessions = $user->examSessions()
            ->with(['exam.examType', 'exam.subCategory'])
            ->latest()
            ->paginate(20);

        return response()->json($sessions);
    }

    public function quizSessions(Request $request)
    {
        $user = $request->user();
        
        $sessions = $user->quizSessions()
            ->with(['quiz.quizType', 'quiz.subCategory'])
            ->latest()
            ->paginate(20);

        return response()->json($sessions);
    }

    public function practiceSessions(Request $request)
    {
        $user = $request->user();
        
        $sessions = $user->practiceSessions()
            ->with(['practiceSet.subCategory'])
            ->latest()
            ->paginate(20);

        return response()->json($sessions);
    }
}

