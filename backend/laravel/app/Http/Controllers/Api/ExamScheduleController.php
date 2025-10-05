<?php

namespace App\Http\Controllers\Api;

use App\Filters\ExamScheduleFilters;
use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExamScheduleController extends Controller
{
    public function index(Request $request, Exam $exam, ExamScheduleFilters $filters): JsonResponse
    {
        $query = $exam->examSchedules()->filter($filters)->orderBy('id', 'desc');

        $perPage = (int) $request->get('per_page', 10);
        $schedules = $query->paginate($perPage);

        return response()->json([
            'data' => $schedules->items(),
            'meta' => [
                'current_page' => $schedules->currentPage(),
                'last_page' => $schedules->lastPage(),
                'per_page' => $schedules->perPage(),
                'total' => $schedules->total(),
            ],
        ]);
    }

    public function store(Request $request, Exam $exam): JsonResponse
    {
        $validated = $this->validatePayload($request);

        $schedule = new ExamSchedule();
        $schedule->exam_id = $exam->id;
        $schedule->schedule_type = $validated['schedule_type'];
        $schedule->status = $validated['status'];

        // start
        $startDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $validated['start_date'].' '.$validated['start_time']);
        $schedule->start_date = $startDateTime->toDateString();
        $schedule->start_time = $startDateTime->toTimeString();

        if ($validated['schedule_type'] === 'fixed') {
            $schedule->grace_period = (int) $validated['grace_period'];
            // end = start + exam total_duration seconds
            $endDateTime = (clone $startDateTime)->addSeconds((int) $exam->total_duration);
            $schedule->end_date = $endDateTime->toDateString();
            $schedule->end_time = $endDateTime->toTimeString();
        } else { // flexible
            $endDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $validated['end_date'].' '.$validated['end_time']);
            $schedule->end_date = $endDateTime->toDateString();
            $schedule->end_time = $endDateTime->toTimeString();
            $schedule->grace_period = (int) ($validated['grace_period'] ?? 5);
        }

        $schedule->save();

        if (isset($validated['user_groups']) && is_array($validated['user_groups'])) {
            $schedule->userGroups()->sync($validated['user_groups']);
        }

        return response()->json([
            'message' => 'Exam schedule created successfully',
            'data' => $schedule->fresh(),
        ], 201);
    }

    public function show(Exam $exam, ExamSchedule $schedule): JsonResponse
    {
        $this->assertExamSchedule($exam, $schedule);
        return response()->json(['data' => $schedule]);
    }

    public function update(Request $request, Exam $exam, ExamSchedule $schedule): JsonResponse
    {
        $this->assertExamSchedule($exam, $schedule);
        $validated = $this->validatePayload($request);

        $schedule->schedule_type = $validated['schedule_type'];
        $schedule->status = $validated['status'];

        $startDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $validated['start_date'].' '.$validated['start_time']);
        $schedule->start_date = $startDateTime->toDateString();
        $schedule->start_time = $startDateTime->toTimeString();

        if ($validated['schedule_type'] === 'fixed') {
            $schedule->grace_period = (int) $validated['grace_period'];
            $endDateTime = (clone $startDateTime)->addSeconds((int) $exam->total_duration);
            $schedule->end_date = $endDateTime->toDateString();
            $schedule->end_time = $endDateTime->toTimeString();
        } else {
            $endDateTime = Carbon::createFromFormat('Y-m-d H:i:s', $validated['end_date'].' '.$validated['end_time']);
            $schedule->end_date = $endDateTime->toDateString();
            $schedule->end_time = $endDateTime->toTimeString();
            $schedule->grace_period = (int) ($validated['grace_period'] ?? 5);
        }

        $schedule->save();

        if (isset($validated['user_groups']) && is_array($validated['user_groups'])) {
            $schedule->userGroups()->sync($validated['user_groups']);
        }

        return response()->json([
            'message' => 'Exam schedule updated successfully',
            'data' => $schedule->fresh(),
        ]);
    }

    public function destroy(Exam $exam, ExamSchedule $schedule): JsonResponse
    {
        $this->assertExamSchedule($exam, $schedule);
        $schedule->delete();
        return response()->json(['message' => 'Exam schedule deleted successfully']);
    }

    private function validatePayload(Request $request): array
    {
        $rules = [
            'schedule_type' => ['required', 'in:fixed,flexible'],
            'start_date' => ['required', 'date_format:Y-m-d'],
            'start_time' => ['required', 'date_format:H:i:s'],
            'status' => ['required', 'in:active,inactive,expired,cancelled'],
            'grace_period' => ['nullable', 'integer', 'min:1'],
            'user_groups' => ['sometimes', 'array'],
            'user_groups.*' => ['integer'],
        ];

        if ($request->get('schedule_type') === 'flexible') {
            $rules['end_date'] = ['required', 'date_format:Y-m-d', 'after_or_equal:start_date'];
            $rules['end_time'] = ['required', 'date_format:H:i:s'];
        }

        $validated = $request->validate($rules);

        if (($validated['schedule_type'] ?? null) === 'flexible') {
            // If same day, ensure end_time after start_time
            if (($validated['start_date'] ?? null) === ($validated['end_date'] ?? null)) {
                $start = Carbon::createFromFormat('H:i:s', $validated['start_time']);
                $end = Carbon::createFromFormat('H:i:s', $validated['end_time']);
                if ($end->lessThanOrEqualTo($start)) {
                    abort(response()->json(['message' => 'End time must be after start time for the same day'], 422));
                }
            }
        }

        return $validated;
    }

    private function assertExamSchedule(Exam $exam, ExamSchedule $schedule): void
    {
        if ($schedule->exam_id !== $exam->id) {
            abort(404);
        }
    }
}


