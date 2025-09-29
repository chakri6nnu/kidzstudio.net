<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class PlanController extends Controller
{
    /**
     * Display a listing of plans
     */
    public function index(Request $request): JsonResponse
    {
        $query = Plan::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Type filter
        if ($request->has('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Price range filter
        if ($request->has('price_min') && $request->price_min) {
            $query->where('price', '>=', $request->price_min);
        }
        if ($request->has('price_max') && $request->price_max) {
            $query->where('price', '<=', $request->price_max);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $plans = $query->withCount(['subscriptions'])
                       ->orderBy('created_at', 'desc')
                       ->paginate($perPage);

        return response()->json([
            'data' => $plans->items(),
            'meta' => [
                'current_page' => $plans->currentPage(),
                'last_page' => $plans->lastPage(),
                'per_page' => $plans->perPage(),
                'total' => $plans->total(),
            ],
        ]);
    }

    /**
     * Store a newly created plan
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:plans,name',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|string|in:free,premium,enterprise',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'billing_cycle' => 'required|string|in:monthly,yearly,lifetime',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'trial_days' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $plan = Plan::create($request->all());
        $plan->loadCount(['subscriptions']);

        return response()->json([
            'message' => 'Plan created successfully',
            'data' => $plan,
        ], 201);
    }

    /**
     * Display the specified plan
     */
    public function show(Plan $plan): JsonResponse
    {
        $plan->loadCount(['subscriptions']);
        
        return response()->json([
            'data' => $plan,
        ]);
    }

    /**
     * Update the specified plan
     */
    public function update(Request $request, Plan $plan): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:plans,name,' . $plan->id,
            'description' => 'nullable|string|max:1000',
            'type' => 'required|string|in:free,premium,enterprise',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|max:3',
            'billing_cycle' => 'required|string|in:monthly,yearly,lifetime',
            'features' => 'nullable|array',
            'features.*' => 'string',
            'is_active' => 'boolean',
            'sort_order' => 'nullable|integer|min:0',
            'trial_days' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $plan->update($request->all());
        $plan->loadCount(['subscriptions']);

        return response()->json([
            'message' => 'Plan updated successfully',
            'data' => $plan,
        ]);
    }

    /**
     * Remove the specified plan
     */
    public function destroy(Plan $plan): JsonResponse
    {
        // Check if plan has associated subscriptions
        if ($plan->subscriptions()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete plan with active subscriptions',
            ], 422);
        }

        $plan->delete();

        return response()->json([
            'message' => 'Plan deleted successfully',
        ]);
    }
}
