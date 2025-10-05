<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamSchedule;
use App\Models\QuizSchedule;
use App\Settings\LocalizationSettings;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Validator;
use Jackiedo\DotenvEditor\Facades\DotenvEditor;
use App\Http\Controllers\AppUpdateController;

class MaintenanceController extends Controller
{
    public function __construct()
    {
        $this->middleware(['role:admin']);
    }

    public function status(): JsonResponse
    {
        return response()->json([
            'appVersion' => config('qwiktest.version'),
            'debugMode' => config('app.debug')
        ]);
    }

    public function clearCache(): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json(['message' => 'Demo Mode! These settings can\'t be changed.', 'success' => false], 403);
        }

        Artisan::call('cache:forget', ['key' => 'spatie.permission.cache']);
        Artisan::call('config:clear');
        Artisan::call('cache:clear');
        Artisan::call('view:clear');
        Artisan::call('route:clear');

        return response()->json(['message' => 'Cache cleared successfully.', 'success' => true]);
    }

    public function fixStorageLinks(): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json(['message' => 'Demo Mode! These settings can\'t be changed.', 'success' => false], 403);
        }

        Artisan::call('storage:link');

        return response()->json(['message' => 'Storage linked successfully.', 'success' => true]);
    }

    public function expireSchedules(LocalizationSettings $localization): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json(['message' => 'Demo Mode! These settings can\'t be changed.', 'success' => false], 403);
        }

        $now = Carbon::now()->timezone($localization->default_timezone);

        $quizSchedules = QuizSchedule::where('end_date', '<=', $now->toDateString())
            ->where('status', '=', 'active')->get();

        foreach ($quizSchedules as $schedule) {
            $schedule->status = 'expired';
            $schedule->update();
        }

        $examSchedules = ExamSchedule::where('end_date', '<=', $now->toDateString())
            ->where('status', '=', 'active')->get();

        foreach ($examSchedules as $schedule) {
            $schedule->status = 'expired';
            $schedule->update();
        }

        return response()->json([
            'message' => 'Schedules updated successfully.', 
            'success' => true, 
            'quizExpired' => $quizSchedules->count(), 
            'examExpired' => $examSchedules->count()
        ]);
    }

    public function debugMode(Request $request): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json(['message' => 'Demo Mode! These settings can\'t be changed.', 'success' => false], 403);
        }

        $validator = Validator::make($request->all(), [
            'mode' => ['required', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors(), 'success' => false], 422);
        }

        $env = DotenvEditor::load();
        $env->setKey('APP_DEBUG', $request->get('mode') == true ? 'true' : 'false');
        $env->save();

        $status = $request->get('mode') == true ? 'Enabled' : 'Disabled';

        return response()->json([
            'message' => "Debug mode {$status} successfully.", 
            'success' => true, 
            'debugMode' => $request->get('mode')
        ]);
    }

    public function fixUpdates(AppUpdateController $appUpdateController): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json(['message' => 'Demo Mode! These settings can\'t be changed.', 'success' => false], 403);
        }

        // Call the onSuccessfulUpdate method from AppUpdateController
        $response = $appUpdateController->onSuccessfulUpdate();

        // The onSuccessfulUpdate method returns a redirect response,
        // which we need to convert to a JSON response for the API.
        // This is a simplified conversion; a more robust solution might
        // involve modifying AppUpdateController to return JsonResponse directly.
        if ($response->getSession()->has('successMessage')) {
            return response()->json(['message' => $response->getSession()->get('successMessage'), 'success' => true]);
        } elseif ($response->getSession()->has('errorMessage')) {
            return response()->json(['message' => $response->getSession()->get('errorMessage'), 'success' => false], 400);
        }

        return response()->json(['message' => 'Update process completed.', 'success' => true]);
    }
}