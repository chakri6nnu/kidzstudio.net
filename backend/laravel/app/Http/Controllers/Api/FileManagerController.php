<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class FileManagerController extends Controller
{
    protected $disk = 'public';
    protected $basePath = 'uploads';

    public function index(Request $request)
    {
        $path = $request->get('path', '');
        $search = $request->get('search', '');
        $type = $request->get('type', 'all'); // all, image, document, video, audio
        $sort = $request->get('sort', 'name'); // name, size, modified
        $order = $request->get('order', 'asc'); // asc, desc

        $fullPath = $this->getFullPath($path);
        
        if (!Storage::disk($this->disk)->exists($fullPath)) {
            return response()->json(['error' => 'Directory not found'], 404);
        }

        $items = $this->getDirectoryContents($fullPath, $search, $type, $sort, $order);
        
        return response()->json([
            'path' => $path,
            'items' => $items,
            'breadcrumbs' => $this->getBreadcrumbs($path),
            'parent_path' => $this->getParentPath($path),
        ]);
    }

    public function upload(Request $request)
    {
        \Log::info('File upload request received', [
            'path' => $request->get('path', ''),
            'files_count' => $request->hasFile('files') ? count($request->file('files')) : 0,
            'user' => auth()->user() ? auth()->user()->name : 'Guest'
        ]);

        $request->validate([
            'files.*' => 'required|file|max:10240', // 10MB max
            'path' => 'nullable|string',
        ]);

        $path = $request->get('path', '');
        $fullPath = $this->getFullPath($path);
        
        \Log::info('Upload path resolved', ['fullPath' => $fullPath]);
        
        $uploadedFiles = [];
        $errors = [];

        foreach ($request->file('files') as $file) {
            try {
                $originalName = $file->getClientOriginalName();
                $extension = $file->getClientOriginalExtension();
                $filename = pathinfo($originalName, PATHINFO_FILENAME);
                $filename = Str::slug($filename) . '.' . $extension;
                
                \Log::info('Processing file', [
                    'original' => $originalName,
                    'filename' => $filename,
                    'size' => $file->getSize()
                ]);
                
                // Generate unique filename if file exists
                $counter = 1;
                $originalFilename = $filename;
                while (Storage::disk($this->disk)->exists($fullPath . '/' . $filename)) {
                    $filename = pathinfo($originalFilename, PATHINFO_FILENAME) . '_' . $counter . '.' . $extension;
                    $counter++;
                }

                $filePath = $file->storeAs($fullPath, $filename, $this->disk);
                
                \Log::info('File stored successfully', ['filePath' => $filePath]);
                
                // Generate thumbnail for images
                if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $this->generateThumbnail($filePath);
                }

                $uploadedFiles[] = [
                    'name' => $filename,
                    'path' => $filePath,
                    'size' => $file->getSize(),
                    'type' => $this->getFileType($extension),
                    'url' => Storage::disk($this->disk)->url($filePath),
                ];
            } catch (\Exception $e) {
                \Log::error('File upload error', [
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ]);
                
                $errors[] = [
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage(),
                ];
            }
        }

        \Log::info('Upload completed', [
            'uploaded_count' => count($uploadedFiles),
            'errors_count' => count($errors)
        ]);

        return response()->json([
            'uploaded' => $uploadedFiles,
            'errors' => $errors,
        ]);
    }

    public function createFolder(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'path' => 'nullable|string',
        ]);

        $path = $request->get('path', '');
        $folderName = $request->get('name');
        $fullPath = $this->getFullPath($path . '/' . $folderName);

        if (Storage::disk($this->disk)->exists($fullPath)) {
            return response()->json(['error' => 'Folder already exists'], 400);
        }

        Storage::disk($this->disk)->makeDirectory($fullPath);

        return response()->json([
            'message' => 'Folder created successfully',
            'path' => $path . '/' . $folderName,
        ]);
    }

    public function rename(Request $request)
    {
        $request->validate([
            'old_name' => 'required|string',
            'new_name' => 'required|string|max:255',
            'path' => 'nullable|string',
        ]);

        $path = $request->get('path', '');
        $oldName = $request->get('old_name');
        $newName = $request->get('new_name');
        
        $oldPath = $this->getFullPath($path . '/' . $oldName);
        $newPath = $this->getFullPath($path . '/' . $newName);

        if (!Storage::disk($this->disk)->exists($oldPath)) {
            return response()->json(['error' => 'File or folder not found'], 404);
        }

        if (Storage::disk($this->disk)->exists($newPath)) {
            return response()->json(['error' => 'A file or folder with this name already exists'], 400);
        }

        Storage::disk($this->disk)->move($oldPath, $newPath);

        return response()->json(['message' => 'Renamed successfully']);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*' => 'required|string',
            'path' => 'nullable|string',
        ]);

        $path = $request->get('path', '');
        $items = $request->get('items');
        $deleted = [];
        $errors = [];

        foreach ($items as $item) {
            try {
                $fullPath = $this->getFullPath($path . '/' . $item);
                
                if (Storage::disk($this->disk)->exists($fullPath)) {
                    if (Storage::disk($this->disk)->mimeType($fullPath) === 'directory') {
                        Storage::disk($this->disk)->deleteDirectory($fullPath);
                    } else {
                        Storage::disk($this->disk)->delete($fullPath);
                        // Delete thumbnail if exists
                        $this->deleteThumbnail($fullPath);
                    }
                    $deleted[] = $item;
                }
            } catch (\Exception $e) {
                $errors[] = [
                    'item' => $item,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'deleted' => $deleted,
            'errors' => $errors,
        ]);
    }

    public function move(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*' => 'required|string',
            'from_path' => 'nullable|string',
            'to_path' => 'required|string',
        ]);

        $fromPath = $request->get('from_path', '');
        $toPath = $request->get('to_path');
        $items = $request->get('items');
        $moved = [];
        $errors = [];

        foreach ($items as $item) {
            try {
                $sourcePath = $this->getFullPath($fromPath . '/' . $item);
                $destinationPath = $this->getFullPath($toPath . '/' . $item);

                if (Storage::disk($this->disk)->exists($sourcePath)) {
                    Storage::disk($this->disk)->move($sourcePath, $destinationPath);
                    $moved[] = $item;
                }
            } catch (\Exception $e) {
                $errors[] = [
                    'item' => $item,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'moved' => $moved,
            'errors' => $errors,
        ]);
    }

    public function copy(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*' => 'required|string',
            'from_path' => 'nullable|string',
            'to_path' => 'required|string',
        ]);

        $fromPath = $request->get('from_path', '');
        $toPath = $request->get('to_path');
        $items = $request->get('items');
        $copied = [];
        $errors = [];

        foreach ($items as $item) {
            try {
                $sourcePath = $this->getFullPath($fromPath . '/' . $item);
                $destinationPath = $this->getFullPath($toPath . '/' . $item);

                if (Storage::disk($this->disk)->exists($sourcePath)) {
                    if (Storage::disk($this->disk)->mimeType($sourcePath) === 'directory') {
                        $this->copyDirectory($sourcePath, $destinationPath);
                    } else {
                        Storage::disk($this->disk)->copy($sourcePath, $destinationPath);
                    }
                    $copied[] = $item;
                }
            } catch (\Exception $e) {
                $errors[] = [
                    'item' => $item,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'copied' => $copied,
            'errors' => $errors,
        ]);
    }

    public function download(Request $request)
    {
        $path = $request->get('path', '');
        $item = $request->get('item');
        
        $fullPath = $this->getFullPath($path . '/' . $item);

        if (!Storage::disk($this->disk)->exists($fullPath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return Storage::disk($this->disk)->download($fullPath);
    }

    public function preview(Request $request)
    {
        $path = $request->get('path', '');
        $item = $request->get('item');
        
        $fullPath = $this->getFullPath($path . '/' . $item);

        if (!Storage::disk($this->disk)->exists($fullPath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        $mimeType = Storage::disk($this->disk)->mimeType($fullPath);
        $url = Storage::disk($this->disk)->url($fullPath);

        return response()->json([
            'url' => $url,
            'mime_type' => $mimeType,
            'size' => Storage::disk($this->disk)->size($fullPath),
        ]);
    }

    private function getFullPath($path)
    {
        return $this->basePath . ($path ? '/' . ltrim($path, '/') : '');
    }

    private function getDirectoryContents($path, $search = '', $type = 'all', $sort = 'name', $order = 'asc')
    {
        $items = [];
        $files = Storage::disk($this->disk)->files($path);
        $directories = Storage::disk($this->disk)->directories($path);

        // Process directories
        foreach ($directories as $directory) {
            $name = basename($directory);
            $items[] = [
                'name' => $name,
                'type' => 'directory',
                'path' => str_replace($this->basePath . '/', '', $directory),
                'size' => $this->getDirectorySize($directory),
                'modified' => Storage::disk($this->disk)->lastModified($directory),
                'url' => null,
                'thumbnail' => null,
            ];
        }

        // Process files
        foreach ($files as $file) {
            $name = basename($file);
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            $fileType = $this->getFileType($extension);
            
            // Apply type filter
            if ($type !== 'all' && $fileType !== $type) {
                continue;
            }

            // Apply search filter
            if ($search && stripos($name, $search) === false) {
                continue;
            }

            $items[] = [
                'name' => $name,
                'type' => 'file',
                'file_type' => $fileType,
                'path' => str_replace($this->basePath . '/', '', $file),
                'size' => Storage::disk($this->disk)->size($file),
                'modified' => Storage::disk($this->disk)->lastModified($file),
                'url' => Storage::disk($this->disk)->url($file),
                'thumbnail' => $this->getThumbnailUrl($file, $fileType),
            ];
        }

        // Sort items
        usort($items, function ($a, $b) use ($sort, $order) {
            $valueA = $a[$sort] ?? '';
            $valueB = $b[$sort] ?? '';
            
            if ($sort === 'size' || $sort === 'modified') {
                $result = $valueA <=> $valueB;
            } else {
                $result = strcasecmp($valueA, $valueB);
            }
            
            return $order === 'desc' ? -$result : $result;
        });

        return $items;
    }

    private function getFileType($extension)
    {
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
        $documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'];
        $videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
        $audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];

        if (in_array($extension, $imageExtensions)) {
            return 'image';
        } elseif (in_array($extension, $documentExtensions)) {
            return 'document';
        } elseif (in_array($extension, $videoExtensions)) {
            return 'video';
        } elseif (in_array($extension, $audioExtensions)) {
            return 'audio';
        }

        return 'other';
    }

    private function getDirectorySize($path)
    {
        $size = 0;
        $files = Storage::disk($this->disk)->allFiles($path);
        
        foreach ($files as $file) {
            $size += Storage::disk($this->disk)->size($file);
        }
        
        return $size;
    }

    private function getBreadcrumbs($path)
    {
        $breadcrumbs = [['name' => 'Home', 'path' => '']];
        
        if ($path) {
            $segments = explode('/', $path);
            $currentPath = '';
            
            foreach ($segments as $segment) {
                if ($segment) {
                    $currentPath .= ($currentPath ? '/' : '') . $segment;
                    $breadcrumbs[] = [
                        'name' => $segment,
                        'path' => $currentPath,
                    ];
                }
            }
        }
        
        return $breadcrumbs;
    }

    private function getParentPath($path)
    {
        if (!$path) {
            return null;
        }
        
        $segments = explode('/', $path);
        array_pop($segments);
        
        return implode('/', $segments);
    }

    private function generateThumbnail($filePath)
    {
        try {
            $thumbnailPath = str_replace($this->basePath, $this->basePath . '/thumbnails', $filePath);
            $thumbnailDir = dirname($thumbnailPath);
            
            Storage::disk($this->disk)->makeDirectory($thumbnailDir);
            
            $image = Image::make(Storage::disk($this->disk)->path($filePath));
            $image->resize(200, 200, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
            
            $image->save(Storage::disk($this->disk)->path($thumbnailPath));
        } catch (\Exception $e) {
            // Thumbnail generation failed, continue without it
        }
    }

    private function getThumbnailUrl($filePath, $fileType)
    {
        if ($fileType !== 'image') {
            return null;
        }
        
        $thumbnailPath = str_replace($this->basePath, $this->basePath . '/thumbnails', $filePath);
        
        if (Storage::disk($this->disk)->exists($thumbnailPath)) {
            return Storage::disk($this->disk)->url($thumbnailPath);
        }
        
        return null;
    }

    private function deleteThumbnail($filePath)
    {
        $thumbnailPath = str_replace($this->basePath, $this->basePath . '/thumbnails', $filePath);
        
        if (Storage::disk($this->disk)->exists($thumbnailPath)) {
            Storage::disk($this->disk)->delete($thumbnailPath);
        }
    }

    private function copyDirectory($source, $destination)
    {
        Storage::disk($this->disk)->makeDirectory($destination);
        
        $files = Storage::disk($this->disk)->allFiles($source);
        
        foreach ($files as $file) {
            $relativePath = str_replace($source . '/', '', $file);
            Storage::disk($this->disk)->copy($file, $destination . '/' . $relativePath);
        }
    }
}
