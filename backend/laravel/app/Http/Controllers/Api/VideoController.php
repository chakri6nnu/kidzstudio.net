<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class VideoController extends Controller
{
    /**
     * Display a listing of videos
     */
    public function index(Request $request): JsonResponse
    {
        $query = Video::query();

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('category', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Quality filter
        if ($request->has('quality') && $request->quality) {
            $query->where('quality', $request->quality);
        }

        // Active filter
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $videos = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $videos->items(),
            'meta' => [
                'current_page' => $videos->currentPage(),
                'last_page' => $videos->lastPage(),
                'per_page' => $videos->perPage(),
                'total' => $videos->total(),
            ],
        ]);
    }

    /**
     * Store a newly created video
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:100',
            'sub_category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'quality' => 'required|string|in:480p,720p,1080p',
            'status' => 'required|string|in:Draft,Published,Processing,Failed',
            'is_active' => 'boolean',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:102400', // 100MB max
            'thumbnail_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $video = new Video();
        $video->title = $request->title;
        $video->description = $request->description;
        $video->category = $request->category;
        $video->sub_category = $request->sub_category;
        $video->tags = $request->tags;
        $video->quality = $request->quality;
        $video->status = $request->status;
        $video->is_active = $request->boolean('is_active', true);
        $video->duration = '0:00'; // Will be updated after processing
        $video->size = '0 MB'; // Will be updated after processing
        $video->format = 'MP4';
        $video->views = 0;
        $video->uploaded_by = auth()->user()->name ?? 'Admin';

        // Handle file uploads
        if ($request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('videos', 'public');
            $video->video_url = Storage::url($videoPath);
        }

        if ($request->hasFile('thumbnail_file')) {
            $thumbnailPath = $request->file('thumbnail_file')->store('thumbnails', 'public');
            $video->thumbnail = Storage::url($thumbnailPath);
        } else {
            $video->thumbnail = '/placeholder.svg';
        }

        $video->save();

        return response()->json([
            'message' => 'Video created successfully',
            'data' => $video,
        ], 201);
    }

    /**
     * Display the specified video
     */
    public function show(Video $video): JsonResponse
    {
        return response()->json([
            'data' => $video,
        ]);
    }

    /**
     * Update the specified video
     */
    public function update(Request $request, Video $video): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|max:100',
            'sub_category' => 'nullable|string|max:100',
            'tags' => 'nullable|string',
            'quality' => 'sometimes|required|string|in:480p,720p,1080p',
            'status' => 'sometimes|required|string|in:Draft,Published,Processing,Failed',
            'is_active' => 'boolean',
            'video_file' => 'nullable|file|mimes:mp4,avi,mov,wmv|max:102400',
            'thumbnail_file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Update fields
        if ($request->has('title')) {
            $video->title = $request->title;
        }
        if ($request->has('description')) {
            $video->description = $request->description;
        }
        if ($request->has('category')) {
            $video->category = $request->category;
        }
        if ($request->has('sub_category')) {
            $video->sub_category = $request->sub_category;
        }
        if ($request->has('tags')) {
            $video->tags = $request->tags;
        }
        if ($request->has('quality')) {
            $video->quality = $request->quality;
        }
        if ($request->has('status')) {
            $video->status = $request->status;
        }
        if ($request->has('is_active')) {
            $video->is_active = $request->boolean('is_active');
        }

        // Handle file uploads
        if ($request->hasFile('video_file')) {
            // Delete old video file if exists
            if ($video->video_url) {
                $oldPath = str_replace('/storage/', '', $video->video_url);
                Storage::disk('public')->delete($oldPath);
            }
            
            $videoPath = $request->file('video_file')->store('videos', 'public');
            $video->video_url = Storage::url($videoPath);
        }

        if ($request->hasFile('thumbnail_file')) {
            // Delete old thumbnail if exists
            if ($video->thumbnail && $video->thumbnail !== '/placeholder.svg') {
                $oldPath = str_replace('/storage/', '', $video->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }
            
            $thumbnailPath = $request->file('thumbnail_file')->store('thumbnails', 'public');
            $video->thumbnail = Storage::url($thumbnailPath);
        }

        $video->save();

        return response()->json([
            'message' => 'Video updated successfully',
            'data' => $video,
        ]);
    }

    /**
     * Remove the specified video
     */
    public function destroy(Video $video): JsonResponse
    {
        // Delete associated files
        if ($video->video_url) {
            $videoPath = str_replace('/storage/', '', $video->video_url);
            Storage::disk('public')->delete($videoPath);
        }

        if ($video->thumbnail && $video->thumbnail !== '/placeholder.svg') {
            $thumbnailPath = str_replace('/storage/', '', $video->thumbnail);
            Storage::disk('public')->delete($thumbnailPath);
        }

        $video->delete();

        return response()->json([
            'message' => 'Video deleted successfully',
        ]);
    }
}
