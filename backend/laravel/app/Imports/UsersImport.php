<?php

namespace App\Imports;

use App\Models\User;
use App\Models\UserGroup;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class UsersImport implements ToCollection, WithHeadingRow
{
    protected $groupId;
    protected $role;
    protected $sendWelcomeEmail;
    protected $importedCount = 0;
    protected $skippedCount = 0;
    protected $errors = [];

    public function __construct($groupId = null, $role = 'student', $sendWelcomeEmail = false)
    {
        $this->groupId = $groupId;
        $this->role = $role;
        $this->sendWelcomeEmail = $sendWelcomeEmail;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            try {
                // Validate required fields
                $validator = Validator::make($row->toArray(), [
                    'name' => 'required|string|max:255',
                    'email' => 'required|email|unique:users,email',
                ]);

                if ($validator->fails()) {
                    $this->skippedCount++;
                    $this->errors[] = "Row " . ($index + 2) . ": " . implode(', ', $validator->errors()->all());
                    continue;
                }

                // Create user
                $user = new User();
                $user->name = $row['name'];
                $user->email = $row['email'];
                $user->phone = $row['phone'] ?? null;
                $user->role = $this->role;
                $user->group_id = $this->groupId;
                $user->is_active = true;
                $user->password = Hash::make($row['password'] ?? 'password123'); // Default password
                $user->date_of_birth = $row['date_of_birth'] ?? null;
                $user->address = $row['address'] ?? null;
                $user->city = $row['city'] ?? null;
                $user->state = $row['state'] ?? null;
                $user->country = $row['country'] ?? null;
                $user->zip_code = $row['zip_code'] ?? null;
                $user->email_verified_at = now();

                $user->save();

                $this->importedCount++;

                // TODO: Send welcome email if enabled
                if ($this->sendWelcomeEmail) {
                    // Implement email sending logic here
                }

            } catch (\Exception $e) {
                $this->skippedCount++;
                $this->errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
            }
        }
    }

    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    public function getSkippedCount(): int
    {
        return $this->skippedCount;
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}