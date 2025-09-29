<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Display a listing of settings
     */
    public function index(Request $request): JsonResponse
    {
        $query = Setting::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('key', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Category filter
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Type filter
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $settings = $query->orderBy('category')
                          ->orderBy('sort_order')
                          ->orderBy('key')
                          ->paginate($perPage);

        return response()->json([
            'data' => $settings->items(),
            'meta' => [
                'current_page' => $settings->currentPage(),
                'last_page' => $settings->lastPage(),
                'per_page' => $settings->perPage(),
                'total' => $settings->total(),
            ],
        ]);
    }

    /**
     * Store a newly created setting
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:255|unique:settings,key',
            'value' => 'required|string',
            'type' => 'required|string|in:string,number,boolean,json,text',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_public' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $setting = Setting::create($request->all());

        return response()->json([
            'message' => 'Setting created successfully',
            'data' => $setting,
        ], 201);
    }

    /**
     * Display the specified setting
     */
    public function show(Setting $setting): JsonResponse
    {
        return response()->json([
            'data' => $setting,
        ]);
    }

    /**
     * Update the specified setting
     */
    public function update(Request $request, Setting $setting): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:255|unique:settings,key,' . $setting->id,
            'value' => 'required|string',
            'type' => 'required|string|in:string,number,boolean,json,text',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_public' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $setting->update($request->all());

        return response()->json([
            'message' => 'Setting updated successfully',
            'data' => $setting,
        ]);
    }

    /**
     * Remove the specified setting
     */
    public function destroy(Setting $setting): JsonResponse
    {
        $setting->delete();

        return response()->json([
            'message' => 'Setting deleted successfully',
        ]);
    }
}
