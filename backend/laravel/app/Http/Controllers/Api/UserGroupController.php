<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserGroup;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class UserGroupController extends Controller
{
    /**
     * Display a listing of user groups
     */
    public function index(Request $request): JsonResponse
    {
        $query = UserGroup::query();

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('is_active', $request->status === 'active');
        }

        // Type filter
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $userGroups = $query->withCount('users')->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $userGroups->items(),
            'meta' => [
                'current_page' => $userGroups->currentPage(),
                'last_page' => $userGroups->lastPage(),
                'per_page' => $userGroups->perPage(),
                'total' => $userGroups->total(),
            ],
        ]);
    }

    /**
     * Store a newly created user group
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|string|in:academic,administrative,student,staff',
            'color' => 'nullable|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'permissions' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $userGroup = new UserGroup();
        $userGroup->name = $request->name;
        $userGroup->description = $request->description;
        $userGroup->type = $request->type;
        $userGroup->color = $request->color ?? '#3B82F6';
        $userGroup->is_active = $request->boolean('is_active', true);
        $userGroup->permissions = $request->permissions ?? [];
        $userGroup->settings = $request->settings ?? [];

        $userGroup->save();

        return response()->json([
            'message' => 'User group created successfully',
            'data' => $userGroup,
        ], 201);
    }

    /**
     * Display the specified user group
     */
    public function show(UserGroup $userGroup): JsonResponse
    {
        $userGroup->loadCount('users');
        return response()->json([
            'data' => $userGroup,
        ]);
    }

    /**
     * Update the specified user group
     */
    public function update(Request $request, UserGroup $userGroup): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'sometimes|required|string|in:academic,administrative,student,staff',
            'color' => 'nullable|string|max:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'is_active' => 'boolean',
            'permissions' => 'nullable|array',
            'settings' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update fields
        if ($request->has('name')) {
            $userGroup->name = $request->name;
        }
        if ($request->has('description')) {
            $userGroup->description = $request->description;
        }
        if ($request->has('type')) {
            $userGroup->type = $request->type;
        }
        if ($request->has('color')) {
            $userGroup->color = $request->color;
        }
        if ($request->has('is_active')) {
            $userGroup->is_active = $request->boolean('is_active');
        }
        if ($request->has('permissions')) {
            $userGroup->permissions = $request->permissions;
        }
        if ($request->has('settings')) {
            $userGroup->settings = $request->settings;
        }

        $userGroup->save();

        return response()->json([
            'message' => 'User group updated successfully',
            'data' => $userGroup,
        ]);
    }

    /**
     * Remove the specified user group
     */
    public function destroy(UserGroup $userGroup): JsonResponse
    {
        // Check if group has users
        if ($userGroup->users()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete user group with assigned users',
            ], 422);
        }

        $userGroup->delete();

        return response()->json([
            'message' => 'User group deleted successfully',
        ]);
    }
}
