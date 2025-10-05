<?php
/**
 * File name: api.php
 * Last modified: 19/01/21, 5:57 PM
 * Author: NearCraft - https://codecanyon.net/user/nearcraft
 * Copyright (c) 2021
 */

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/version', [ApiController::class, 'index'])->name('api.version');

// Auth (token based) endpoints
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Exam API endpoints
    Route::get('/exams', [\App\Http\Controllers\Api\ExamController::class, 'index']);
    Route::post('/exams', [\App\Http\Controllers\Api\ExamController::class, 'store']);
    Route::get('/exams/{exam}', [\App\Http\Controllers\Api\ExamController::class, 'show']);
    Route::put('/exams/{exam}', [\App\Http\Controllers\Api\ExamController::class, 'update']);
    Route::delete('/exams/{exam}', [\App\Http\Controllers\Api\ExamController::class, 'destroy']);

    // Reference data
    Route::get('/exam-types', [\App\Http\Controllers\Api\LookupController::class, 'examTypes']);
    Route::post('/exam-types', [\App\Http\Controllers\Api\ExamTypeController::class, 'store']);
    Route::get('/exam-types/{examType}', [\App\Http\Controllers\Api\ExamTypeController::class, 'show']);
    Route::put('/exam-types/{examType}', [\App\Http\Controllers\Api\ExamTypeController::class, 'update']);
    Route::delete('/exam-types/{examType}', [\App\Http\Controllers\Api\ExamTypeController::class, 'destroy']);
    Route::get('/question-types', [\App\Http\Controllers\Api\LookupController::class, 'questionTypes']);
    Route::get('/difficulty-levels', [\App\Http\Controllers\Api\LookupController::class, 'difficultyLevels']);
    Route::get('/questions', [\App\Http\Controllers\Api\LookupController::class, 'questions']);

    // Admin dashboard
    Route::get('/admin/dashboard', [\App\Http\Controllers\Api\AdminController::class, 'dashboard']);

    // Admin Users API endpoints
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [\App\Http\Controllers\Api\AdminController::class, 'users']);
        Route::post('/users', [\App\Http\Controllers\Api\AdminController::class, 'storeUser']);
        Route::get('/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'showUser']);
        Route::put('/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'updateUser']);
        Route::delete('/users/{user}', [\App\Http\Controllers\Api\AdminController::class, 'destroyUser']);
        Route::post('/users/bulk-delete', [\App\Http\Controllers\Api\AdminController::class, 'bulkDeleteUsers']);
        
        // Lookup endpoints for dropdowns
        Route::get('/lookup/roles', [\App\Http\Controllers\Api\AdminController::class, 'getRoles']);
        Route::get('/lookup/user-groups', [\App\Http\Controllers\Api\AdminController::class, 'getUserGroups']);
        Route::get('/lookup/subscription-plans', [\App\Http\Controllers\Api\AdminController::class, 'getSubscriptionPlans']);
        
        // Maintenance API endpoints
        Route::get('/maintenance', [\App\Http\Controllers\Api\MaintenanceController::class, 'status']);
        Route::post('/maintenance/clear-cache', [\App\Http\Controllers\Api\MaintenanceController::class, 'clearCache']);
        Route::post('/maintenance/fix-storage-links', [\App\Http\Controllers\Api\MaintenanceController::class, 'fixStorageLinks']);
        Route::post('/maintenance/expire-schedules', [\App\Http\Controllers\Api\MaintenanceController::class, 'expireSchedules']);
        Route::post('/maintenance/debug-mode', [\App\Http\Controllers\Api\MaintenanceController::class, 'debugMode']);
        Route::post('/maintenance/update', [\App\Http\Controllers\Api\MaintenanceController::class, 'fixUpdates']);
        
        // Billing & Tax API endpoints
        Route::get('/billing-tax', [\App\Http\Controllers\Api\BillingTaxController::class, 'index']);
        Route::post('/billing-tax/billing', [\App\Http\Controllers\Api\BillingTaxController::class, 'updateBilling']);
        Route::post('/billing-tax/tax', [\App\Http\Controllers\Api\BillingTaxController::class, 'updateTax']);
        
        // Payment API endpoints
        Route::get('/payment', [\App\Http\Controllers\Api\PaymentController::class, 'index']);
        Route::post('/payment/general', [\App\Http\Controllers\Api\PaymentController::class, 'updatePayment']);
        Route::post('/payment/stripe', [\App\Http\Controllers\Api\PaymentController::class, 'updateStripe']);
        Route::post('/payment/razorpay', [\App\Http\Controllers\Api\PaymentController::class, 'updateRazorpay']);
        Route::post('/payment/paypal', [\App\Http\Controllers\Api\PaymentController::class, 'updatePayPal']);
        Route::post('/payment/bank', [\App\Http\Controllers\Api\PaymentController::class, 'updateBank']);
        
        // Email API endpoints
        Route::get('/email', [\App\Http\Controllers\Api\EmailController::class, 'index']);
        Route::post('/email', [\App\Http\Controllers\Api\EmailController::class, 'update']);
        Route::post('/email/test', [\App\Http\Controllers\Api\EmailController::class, 'test']);
        
        // General Settings API endpoints
        Route::get('/general-settings', [\App\Http\Controllers\Api\GeneralSettingsController::class, 'index']);
        Route::post('/general-settings/site', [\App\Http\Controllers\Api\GeneralSettingsController::class, 'updateSite']);
        Route::post('/general-settings/localization', [\App\Http\Controllers\Api\GeneralSettingsController::class, 'updateLocalization']);
        Route::post('/general-settings/logo', [\App\Http\Controllers\Api\GeneralSettingsController::class, 'updateLogo']);
        Route::post('/general-settings/white-logo', [\App\Http\Controllers\Api\GeneralSettingsController::class, 'updateWhiteLogo']);
        Route::post('/general-settings/favicon', [\App\Http\Controllers\Api\GeneralSettingsController::class, 'updateFavicon']);
        
        // Sections API endpoints
        Route::get('/sections', [\App\Http\Controllers\Api\SectionController::class, 'index']);
        Route::post('/sections', [\App\Http\Controllers\Api\SectionController::class, 'store']);
        Route::get('/sections/{section}', [\App\Http\Controllers\Api\SectionController::class, 'show']);
        Route::put('/sections/{section}', [\App\Http\Controllers\Api\SectionController::class, 'update']);
        Route::delete('/sections/{section}', [\App\Http\Controllers\Api\SectionController::class, 'destroy']);
        
        // Skills API endpoints
        Route::get('/skills', [\App\Http\Controllers\Api\SkillController::class, 'index']);
        Route::post('/skills', [\App\Http\Controllers\Api\SkillController::class, 'store']);
        Route::get('/skills/{skill}', [\App\Http\Controllers\Api\SkillController::class, 'show']);
        Route::put('/skills/{skill}', [\App\Http\Controllers\Api\SkillController::class, 'update']);
        Route::delete('/skills/{skill}', [\App\Http\Controllers\Api\SkillController::class, 'destroy']);
        
        // Topics API endpoints
        Route::get('/topics', [\App\Http\Controllers\Api\TopicController::class, 'index']);
        Route::post('/topics', [\App\Http\Controllers\Api\TopicController::class, 'store']);
        Route::get('/topics/{topic}', [\App\Http\Controllers\Api\TopicController::class, 'show']);
        Route::put('/topics/{topic}', [\App\Http\Controllers\Api\TopicController::class, 'update']);
        Route::delete('/topics/{topic}', [\App\Http\Controllers\Api\TopicController::class, 'destroy']);
        
        // Categories API endpoints
        Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
        Route::post('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'store']);
        Route::get('/categories/{category}', [\App\Http\Controllers\Api\CategoryController::class, 'show']);
        Route::put('/categories/{category}', [\App\Http\Controllers\Api\CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [\App\Http\Controllers\Api\CategoryController::class, 'destroy']);
    });

    // Public browse APIs (no admin middleware)
    Route::get('/skills', [\App\Http\Controllers\Api\SkillController::class, 'index']);

    // Exam sections and questions attach/remove
    Route::get('/exams/{exam}/sections', [\App\Http\Controllers\Api\ExamController::class, 'sections']);
    Route::get('/exams/{exam}/sections/{section}/questions', [\App\Http\Controllers\Api\ExamSectionQuestionController::class, 'index']);
    Route::post('/exams/{exam}/sections/{section}/questions', [\App\Http\Controllers\Api\ExamSectionQuestionController::class, 'store']);
    Route::delete('/exams/{exam}/sections/{section}/questions/{question}', [\App\Http\Controllers\Api\ExamSectionQuestionController::class, 'destroy']);

    // Exam schedules CRUD
    Route::get('/exams/{exam}/schedules', [\App\Http\Controllers\Api\ExamScheduleController::class, 'index']);
    Route::post('/exams/{exam}/schedules', [\App\Http\Controllers\Api\ExamScheduleController::class, 'store']);
    Route::get('/exams/{exam}/schedules/{schedule}', [\App\Http\Controllers\Api\ExamScheduleController::class, 'show']);
    Route::put('/exams/{exam}/schedules/{schedule}', [\App\Http\Controllers\Api\ExamScheduleController::class, 'update']);
    Route::delete('/exams/{exam}/schedules/{schedule}', [\App\Http\Controllers\Api\ExamScheduleController::class, 'destroy']);

    // Exam analytics (API for frontend pages)
    Route::get('/exams/{exam}/analytics/overall', [\App\Http\Controllers\Api\ExamAnalyticsController::class, 'overall']);
    Route::get('/exams/{exam}/analytics/detailed', [\App\Http\Controllers\Api\ExamAnalyticsController::class, 'detailed']);

    // Quiz API endpoints
    Route::get('/quizzes', [\App\Http\Controllers\Api\QuizController::class, 'index']);
    Route::post('/quizzes', [\App\Http\Controllers\Api\QuizController::class, 'store']);
    Route::get('/quizzes/{quiz}', [\App\Http\Controllers\Api\QuizController::class, 'show']);
    Route::put('/quizzes/{quiz}', [\App\Http\Controllers\Api\QuizController::class, 'update']);
    Route::delete('/quizzes/{quiz}', [\App\Http\Controllers\Api\QuizController::class, 'destroy']);

    // Quiz questions attach/remove/view
    Route::get('/quizzes/{quiz}/questions', [\App\Http\Controllers\Api\QuizQuestionController::class, 'index']);
    Route::post('/quizzes/{quiz}/questions', [\App\Http\Controllers\Api\QuizQuestionController::class, 'store']);
    Route::delete('/quizzes/{quiz}/questions/{question}', [\App\Http\Controllers\Api\QuizQuestionController::class, 'destroy']);

    // Quiz Types API endpoints
    Route::get('/quiz-types', [\App\Http\Controllers\Api\QuizTypeController::class, 'index']);
    Route::post('/quiz-types', [\App\Http\Controllers\Api\QuizTypeController::class, 'store']);
    Route::get('/quiz-types/{quizType}', [\App\Http\Controllers\Api\QuizTypeController::class, 'show']);
    Route::put('/quiz-types/{quizType}', [\App\Http\Controllers\Api\QuizTypeController::class, 'update']);
    Route::delete('/quiz-types/{quizType}', [\App\Http\Controllers\Api\QuizTypeController::class, 'destroy']);

    // Admin Practice Sets API endpoints
    Route::middleware('role:admin|instructor')->prefix('admin')->group(function () {
        Route::get('/practice-sets', [\App\Http\Controllers\Api\PracticeSetController::class, 'index']);
        Route::post('/practice-sets', [\App\Http\Controllers\Api\PracticeSetController::class, 'store']);
        Route::get('/practice-sets/{practiceSet}', [\App\Http\Controllers\Api\PracticeSetController::class, 'show']);
        Route::put('/practice-sets/{practiceSet}', [\App\Http\Controllers\Api\PracticeSetController::class, 'update']);
        Route::delete('/practice-sets/{practiceSet}', [\App\Http\Controllers\Api\PracticeSetController::class, 'destroy']);

        // Practice set questions attach/remove/view
        Route::get('/practice-sets/{practiceSet}/questions', [\App\Http\Controllers\Api\PracticeSetController::class, 'questions']);
        Route::post('/practice-sets/{practiceSet}/questions', [\App\Http\Controllers\Api\PracticeSetController::class, 'addQuestions']);
        Route::delete('/practice-sets/{practiceSet}/questions/{question}', [\App\Http\Controllers\Api\PracticeSetController::class, 'removeQuestion']);
    });

    // Import questions
    Route::post('/questions/import', [\App\Http\Controllers\Api\QuestionImportController::class, 'store']);

    // Comprehensions API endpoints
    Route::get('/comprehensions', [\App\Http\Controllers\Api\ComprehensionController::class, 'index']);
    Route::post('/comprehensions', [\App\Http\Controllers\Api\ComprehensionController::class, 'store']);
    Route::get('/comprehensions/{comprehension}', [\App\Http\Controllers\Api\ComprehensionController::class, 'show']);
    Route::put('/comprehensions/{comprehension}', [\App\Http\Controllers\Api\ComprehensionController::class, 'update']);
    Route::delete('/comprehensions/{comprehension}', [\App\Http\Controllers\Api\ComprehensionController::class, 'destroy']);

    // Question Types API endpoints
    Route::get('/question-types', [\App\Http\Controllers\Api\QuestionTypeController::class, 'index']);
    Route::post('/question-types', [\App\Http\Controllers\Api\QuestionTypeController::class, 'store']);
    Route::get('/question-types/{questionType}', [\App\Http\Controllers\Api\QuestionTypeController::class, 'show']);
    Route::put('/question-types/{questionType}', [\App\Http\Controllers\Api\QuestionTypeController::class, 'update']);
    Route::delete('/question-types/{questionType}', [\App\Http\Controllers\Api\QuestionTypeController::class, 'destroy']);

    // Lessons API endpoints
    Route::get('/lessons', [\App\Http\Controllers\Api\LessonController::class, 'index']);
    Route::post('/lessons', [\App\Http\Controllers\Api\LessonController::class, 'store']);
    Route::get('/lessons/{lesson}', [\App\Http\Controllers\Api\LessonController::class, 'show']);
    Route::put('/lessons/{lesson}', [\App\Http\Controllers\Api\LessonController::class, 'update']);
    Route::delete('/lessons/{lesson}', [\App\Http\Controllers\Api\LessonController::class, 'destroy']);

    // Videos API endpoints
    Route::get('/videos', [\App\Http\Controllers\Api\VideoController::class, 'index']);
    Route::post('/videos', [\App\Http\Controllers\Api\VideoController::class, 'store']);
    Route::get('/videos/{video}', [\App\Http\Controllers\Api\VideoController::class, 'show']);
    Route::put('/videos/{video}', [\App\Http\Controllers\Api\VideoController::class, 'update']);
    Route::delete('/videos/{video}', [\App\Http\Controllers\Api\VideoController::class, 'destroy']);

    // Users API endpoints
    Route::get('/users', [\App\Http\Controllers\Api\UserController::class, 'index']);
    Route::post('/users', [\App\Http\Controllers\Api\UserController::class, 'store']);
    Route::get('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'show']);
    Route::put('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'update']);
    Route::delete('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'destroy']);

    // User Groups API endpoints
    Route::get('/user-groups', [\App\Http\Controllers\Api\UserGroupController::class, 'index']);
    Route::post('/user-groups', [\App\Http\Controllers\Api\UserGroupController::class, 'store']);
    Route::get('/user-groups/{userGroup}', [\App\Http\Controllers\Api\UserGroupController::class, 'show']);
    Route::put('/user-groups/{userGroup}', [\App\Http\Controllers\Api\UserGroupController::class, 'update']);
    Route::delete('/user-groups/{userGroup}', [\App\Http\Controllers\Api\UserGroupController::class, 'destroy']);

    // Import Users
    Route::post('/users/import', [\App\Http\Controllers\Api\UserImportController::class, 'store']);

    // Sub Categories API endpoints
    Route::get('/sub-categories', [\App\Http\Controllers\Api\SubCategoryController::class, 'index']);
    Route::post('/sub-categories', [\App\Http\Controllers\Api\SubCategoryController::class, 'store']);
    Route::get('/sub-categories/{subCategory}', [\App\Http\Controllers\Api\SubCategoryController::class, 'show']);
    Route::put('/sub-categories/{subCategory}', [\App\Http\Controllers\Api\SubCategoryController::class, 'update']);
    Route::delete('/sub-categories/{subCategory}', [\App\Http\Controllers\Api\SubCategoryController::class, 'destroy']);

    // Tags API endpoints
    Route::get('/tags', [\App\Http\Controllers\Api\TagController::class, 'index']);
    Route::post('/tags', [\App\Http\Controllers\Api\TagController::class, 'store']);
    Route::get('/tags/{tag}', [\App\Http\Controllers\Api\TagController::class, 'show']);
    Route::put('/tags/{tag}', [\App\Http\Controllers\Api\TagController::class, 'update']);
    Route::delete('/tags/{tag}', [\App\Http\Controllers\Api\TagController::class, 'destroy']);

    // Plans API endpoints
    Route::get('/plans', [\App\Http\Controllers\Api\PlanController::class, 'index']);
    Route::post('/plans', [\App\Http\Controllers\Api\PlanController::class, 'store']);
    Route::get('/plans/{plan}', [\App\Http\Controllers\Api\PlanController::class, 'show']);
    Route::put('/plans/{plan}', [\App\Http\Controllers\Api\PlanController::class, 'update']);
    Route::delete('/plans/{plan}', [\App\Http\Controllers\Api\PlanController::class, 'destroy']);

    // Subscriptions API endpoints
    Route::get('/subscriptions', [\App\Http\Controllers\Api\SubscriptionController::class, 'index']);
    Route::post('/subscriptions', [\App\Http\Controllers\Api\SubscriptionController::class, 'store']);
    Route::get('/subscriptions/{subscription}', [\App\Http\Controllers\Api\SubscriptionController::class, 'show']);
    Route::put('/subscriptions/{subscription}', [\App\Http\Controllers\Api\SubscriptionController::class, 'update']);
    Route::delete('/subscriptions/{subscription}', [\App\Http\Controllers\Api\SubscriptionController::class, 'destroy']);

    // Settings API endpoints
    Route::get('/settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);
    Route::post('/settings', [\App\Http\Controllers\Api\SettingController::class, 'store']);
    Route::get('/settings/{setting}', [\App\Http\Controllers\Api\SettingController::class, 'show']);
    Route::put('/settings/{setting}', [\App\Http\Controllers\Api\SettingController::class, 'update']);
    Route::delete('/settings/{setting}', [\App\Http\Controllers\Api\SettingController::class, 'destroy']);


    // Student-specific API endpoints
    Route::middleware('role:student')->prefix('student')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Api\StudentController::class, 'dashboard']);
        Route::get('/exams', [\App\Http\Controllers\Api\StudentController::class, 'exams']);
        Route::get('/quizzes', [\App\Http\Controllers\Api\StudentController::class, 'quizzes']);
        Route::get('/practice-sets', [\App\Http\Controllers\Api\StudentController::class, 'practiceSets']);
        Route::get('/progress', [\App\Http\Controllers\Api\StudentController::class, 'progress']);
        Route::get('/exam-sessions', [\App\Http\Controllers\Api\StudentController::class, 'examSessions']);
        Route::get('/quiz-sessions', [\App\Http\Controllers\Api\StudentController::class, 'quizSessions']);
        Route::get('/practice-sessions', [\App\Http\Controllers\Api\StudentController::class, 'practiceSessions']);
    });

    // File Manager API endpoints
    Route::middleware('role:admin')->prefix('file-manager')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\FileManagerController::class, 'index']);
        Route::post('/upload', [\App\Http\Controllers\Api\FileManagerController::class, 'upload']);
        Route::post('/create-folder', [\App\Http\Controllers\Api\FileManagerController::class, 'createFolder']);
        Route::post('/rename', [\App\Http\Controllers\Api\FileManagerController::class, 'rename']);
        Route::post('/delete', [\App\Http\Controllers\Api\FileManagerController::class, 'delete']);
        Route::post('/move', [\App\Http\Controllers\Api\FileManagerController::class, 'move']);
        Route::post('/copy', [\App\Http\Controllers\Api\FileManagerController::class, 'copy']);
        Route::get('/download', [\App\Http\Controllers\Api\FileManagerController::class, 'download']);
        Route::get('/preview', [\App\Http\Controllers\Api\FileManagerController::class, 'preview']);
    });
});

// CORS preflight handler (OPTIONS)
Route::options('{any}', function () {
    return response()->noContent();
})->where('any', '.*');
