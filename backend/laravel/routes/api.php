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
    Route::get('/sub-categories', [\App\Http\Controllers\Api\LookupController::class, 'subCategories']);
    Route::get('/question-types', [\App\Http\Controllers\Api\LookupController::class, 'questionTypes']);
    Route::get('/questions', [\App\Http\Controllers\Api\LookupController::class, 'questions']);

    // Admin dashboard
    Route::get('/admin/dashboard', [\App\Http\Controllers\Api\AdminController::class, 'dashboard']);

    // Exam sections and questions attach/remove
    Route::get('/exams/{exam}/sections/{section}/questions', [\App\Http\Controllers\Api\ExamSectionQuestionController::class, 'index']);
    Route::post('/exams/{exam}/sections/{section}/questions', [\App\Http\Controllers\Api\ExamSectionQuestionController::class, 'store']);
    Route::delete('/exams/{exam}/sections/{section}/questions/{question}', [\App\Http\Controllers\Api\ExamSectionQuestionController::class, 'destroy']);

    // Quiz API endpoints
    Route::get('/quizzes', [\App\Http\Controllers\Api\QuizController::class, 'index']);
    Route::post('/quizzes', [\App\Http\Controllers\Api\QuizController::class, 'store']);
    Route::get('/quizzes/{quiz}', [\App\Http\Controllers\Api\QuizController::class, 'show']);
    Route::put('/quizzes/{quiz}', [\App\Http\Controllers\Api\QuizController::class, 'update']);
    Route::delete('/quizzes/{quiz}', [\App\Http\Controllers\Api\QuizController::class, 'destroy']);

    // Quiz Types API endpoints
    Route::get('/quiz-types', [\App\Http\Controllers\Api\QuizTypeController::class, 'index']);
    Route::post('/quiz-types', [\App\Http\Controllers\Api\QuizTypeController::class, 'store']);
    Route::get('/quiz-types/{quizType}', [\App\Http\Controllers\Api\QuizTypeController::class, 'show']);
    Route::put('/quiz-types/{quizType}', [\App\Http\Controllers\Api\QuizTypeController::class, 'update']);
    Route::delete('/quiz-types/{quizType}', [\App\Http\Controllers\Api\QuizTypeController::class, 'destroy']);

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

    // Categories API endpoints
    Route::get('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'index']);
    Route::post('/categories', [\App\Http\Controllers\Api\CategoryController::class, 'store']);
    Route::get('/categories/{category}', [\App\Http\Controllers\Api\CategoryController::class, 'show']);
    Route::put('/categories/{category}', [\App\Http\Controllers\Api\CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [\App\Http\Controllers\Api\CategoryController::class, 'destroy']);

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
});

// CORS preflight handler (OPTIONS)
Route::options('{any}', function () {
    return response()->noContent();
})->where('any', '.*');
