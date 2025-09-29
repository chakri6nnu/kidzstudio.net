<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Imports\UsersImport;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class UserImportController extends Controller
{
    /**
     * Import users from file
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,xlsx,xls|max:10240', // 10MB max
            'group_id' => 'nullable|integer|exists:user_groups,id',
            'role' => 'nullable|string|in:admin,instructor,student',
            'send_welcome_email' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $file = $request->file('file');
            $groupId = $request->get('group_id');
            $role = $request->get('role', 'student');
            $sendWelcomeEmail = $request->boolean('send_welcome_email', false);

            // Import users using the UsersImport class
            $import = new UsersImport($groupId, $role, $sendWelcomeEmail);
            Excel::import($import, $file);

            $importedCount = $import->getImportedCount();
            $skippedCount = $import->getSkippedCount();
            $errors = $import->getErrors();

            return response()->json([
                'message' => 'Users imported successfully',
                'data' => [
                    'imported_count' => $importedCount,
                    'skipped_count' => $skippedCount,
                    'errors' => $errors,
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Import failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
