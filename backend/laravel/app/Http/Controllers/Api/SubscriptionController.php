<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SubscriptionController extends Controller
{
    /**
     * Display a listing of subscriptions
     */
    public function index(Request $request): JsonResponse
    {
        $query = Subscription::query();

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->whereHas('user', function ($userQuery) use ($request) {
                    $userQuery->where('name', 'like', '%' . $request->search . '%')
                             ->orWhere('email', 'like', '%' . $request->search . '%');
                })
                ->orWhereHas('plan', function ($planQuery) use ($request) {
                    $planQuery->where('name', 'like', '%' . $request->search . '%');
                });
            });
        }

        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Plan filter
        if ($request->has('plan_id') && $request->plan_id !== 'all') {
            $query->where('plan_id', $request->plan_id);
        }

        // Date range filters
        if ($request->has('start_date') && $request->start_date) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date) {
            $query->where('created_at', '<=', $request->end_date);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $subscriptions = $query->with(['user', 'plan'])
                               ->orderBy('created_at', 'desc')
                               ->paginate($perPage);

        return response()->json([
            'data' => $subscriptions->items(),
            'meta' => [
                'current_page' => $subscriptions->currentPage(),
                'last_page' => $subscriptions->lastPage(),
                'per_page' => $subscriptions->perPage(),
                'total' => $subscriptions->total(),
            ],
        ]);
    }

    /**
     * Store a newly created subscription
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'plan_id' => 'required|integer|exists:plans,id',
            'status' => 'required|string|in:active,inactive,cancelled,expired',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'auto_renew' => 'boolean',
            'payment_method' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $subscription = Subscription::create($request->all());
        $subscription->load(['user', 'plan']);

        return response()->json([
            'message' => 'Subscription created successfully',
            'data' => $subscription,
        ], 201);
    }

    /**
     * Display the specified subscription
     */
    public function show(Subscription $subscription): JsonResponse
    {
        $subscription->load(['user', 'plan']);
        
        return response()->json([
            'data' => $subscription,
        ]);
    }

    /**
     * Update the specified subscription
     */
    public function update(Request $request, Subscription $subscription): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id',
            'plan_id' => 'required|integer|exists:plans,id',
            'status' => 'required|string|in:active,inactive,cancelled,expired',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'auto_renew' => 'boolean',
            'payment_method' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $subscription->update($request->all());
        $subscription->load(['user', 'plan']);

        return response()->json([
            'message' => 'Subscription updated successfully',
            'data' => $subscription,
        ]);
    }

    /**
     * Remove the specified subscription
     */
    public function destroy(Subscription $subscription): JsonResponse
    {
        $subscription->delete();

        return response()->json([
            'message' => 'Subscription deleted successfully',
        ]);
    }
}
