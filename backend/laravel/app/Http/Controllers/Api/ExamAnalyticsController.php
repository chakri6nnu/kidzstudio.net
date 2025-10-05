<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSchedule;
use App\Models\ExamSession;
use App\Repositories\ExamRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExamAnalyticsController extends Controller
{
    private ExamRepository $repository;

    public function __construct(ExamRepository $repository)
    {
        $this->repository = $repository;
    }

    public function overall(Request $request, Exam $exam): JsonResponse
    {
        $schedule = $request->get('schedule'); // schedule code (optional)
        $stats = $this->repository->getExamSessionStats($exam->id, $schedule);

        if (empty($stats) || !isset($stats[0])) {
            return response()->json([
                'data' => [
                    'total_attempts' => 0,
                    'pass_count' => 0,
                    'failed_count' => 0,
                    'unique_test_takers' => 0,
                    'avg_time' => 0,
                    'avg_score' => 0,
                    'high_score' => 0,
                    'low_score' => 0,
                    'avg_percentage' => 0,
                    'avg_accuracy' => 0,
                    'avg_speed' => 0,
                    'avg_questions_answered' => 0,
                ],
            ]);
        }

        $row = $stats[0];
        return response()->json([
            'data' => [
                'total_attempts' => (int) $row->total_attempts,
                'pass_count' => (int) $row->pass_count,
                'failed_count' => (int) $row->failed_count,
                'unique_test_takers' => (int) $row->unique_test_takers,
                'avg_time' => (int) round($row->avg_time, 0),
                'avg_score' => (float) round($row->avg_score, 1),
                'high_score' => (float) round($row->high_score, 1),
                'low_score' => (float) round($row->low_score, 1),
                'avg_percentage' => (float) round($row->avg_percentage, 0),
                'avg_accuracy' => (float) round($row->avg_accuracy, 0),
                'avg_speed' => (float) round($row->avg_speed, 0),
                'avg_questions_answered' => (float) round($row->sum_questions > 0 ? ($row->sum_answered / $row->sum_questions) * 100 : 0, 0),
            ],
        ]);
    }

    public function detailed(Request $request, Exam $exam): JsonResponse
    {
        $scheduleCode = $request->get('schedule');
        $perPage = (int) $request->get('per_page', 20);

        $query = ExamSession::with(['user:id,name,email'])
            ->where('exam_id', $exam->id);

        if ($scheduleCode) {
            $schedule = ExamSchedule::where('code', $scheduleCode)->first();
            if ($schedule) {
                $query->where('exam_schedule_id', $schedule->id);
            } else {
                // no sessions if schedule not found
                return response()->json(['data' => [], 'meta' => ['current_page' => 1, 'last_page' => 1, 'per_page' => $perPage, 'total' => 0]]);
            }
        }

        $sessions = $query->orderBy('id', 'desc')->paginate($perPage);

        $data = collect($sessions->items())->map(function (ExamSession $s) use ($exam) {
            return [
                'id' => $s->id,
                'user' => $s->user ? $s->user->name : 'Unknown',
                'completed_on' => $s->completed_at,
                'percentage' => $s->percentage,
                'score' => $s->score . '/' . $exam->total_marks,
                'accuracy' => $s->accuracy,
                'ip' => $s->ip_address,
                'status' => $s->status,
            ];
        })->toArray();

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $sessions->currentPage(),
                'last_page' => $sessions->lastPage(),
                'per_page' => $sessions->perPage(),
                'total' => $sessions->total(),
            ],
        ]);
    }
}


