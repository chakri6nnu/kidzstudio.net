<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Exam;
use App\Models\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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

    /**
     * Get all users with pagination and filtering
     */
    public function users(Request $request): JsonResponse
    {
        $query = User::with(['roles']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Role filter
        if ($request->has('role') && $request->role && $request->role !== 'all') {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        // Status filter
        if ($request->has('status') && $request->status && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Pagination
        $perPage = $request->get('limit', 15);
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Transform users to include computed name field
        $transformedUsers = $users->items();
        foreach ($transformedUsers as $user) {
            $user->name = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
            if (empty($user->name)) {
                $user->name = $user->user_name ?? $user->email;
            }
        }

        return response()->json([
            'data' => $transformedUsers,
            'total' => $users->total(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
        ]);
    }

    /**
     * Store a newly created user
     */
    public function storeUser(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'role' => 'required|string|in:admin,instructor,student',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Split name into first and last name
        $nameParts = explode(' ', trim($request->name), 2);
        $firstName = $nameParts[0] ?? '';
        $lastName = $nameParts[1] ?? '';

        $user = User::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'mobile' => $request->phone,
            'is_active' => $request->get('is_active', true),
        ]);

        // Assign role
        $user->assignRole($request->role);

        // Add computed name field for response
        $user->name = $request->name;

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user->load('roles'),
        ], 201);
    }

    /**
     * Display the specified user
     */
    public function showUser(User $user): JsonResponse
    {
        $user->load('roles');
        
        // Add computed name field
        $user->name = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
        if (empty($user->name)) {
            $user->name = $user->user_name ?? $user->email;
        }

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Update the specified user
     */
    public function updateUser(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'sometimes|nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
            'role' => 'sometimes|string|in:admin,instructor,student',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $updateData = $request->only(['email', 'is_active']);
        
        // Handle name update by splitting into first and last name
        if ($request->has('name')) {
            $nameParts = explode(' ', trim($request->name), 2);
            $updateData['first_name'] = $nameParts[0] ?? '';
            $updateData['last_name'] = $nameParts[1] ?? '';
        }
        
        // Handle phone update (map to mobile field)
        if ($request->has('phone')) {
            $updateData['mobile'] = $request->phone;
        }
        
        if ($request->has('password') && $request->password) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        // Update role if provided
        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        // Add computed name field for response
        $user->name = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
        if (empty($user->name)) {
            $user->name = $user->user_name ?? $user->email;
        }

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user->load('roles'),
        ]);
    }

    /**
     * Remove the specified user
     */
    public function destroyUser(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Bulk delete users
     */
    public function bulkDeleteUsers(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        User::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => 'Users deleted successfully',
        ]);
    }

    /**
     * Get available roles for dropdown
     */
    public function getRoles(): JsonResponse
    {
        $roles = \Spatie\Permission\Models\Role::select('id', 'name', 'display_name')
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $roles,
        ]);
    }

    /**
     * Get user groups for dropdown
     */
    public function getUserGroups(): JsonResponse
    {
        $groups = \App\Models\UserGroup::select('id', 'name', 'description')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json([
            'data' => $groups,
        ]);
    }

    /**
     * Get subscription plans for dropdown
     */
    public function getSubscriptionPlans(): JsonResponse
    {
        $plans = \App\Models\Plan::select('id', 'name', 'price', 'duration', 'is_active')
            ->where('is_active', true)
            ->orderBy('price')
            ->get();

        return response()->json([
            'data' => $plans,
        ]);
    }
}


