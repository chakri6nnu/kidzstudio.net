<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    protected $signature = 'user:create-test';
    protected $description = 'Create a test user for API testing';

    public function handle()
    {
        $user = User::create([
            'name' => 'Test User',
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'admin@admin.com',
            'user_name' => 'admin',
            'password' => Hash::make('1122'),
            'is_active' => true,
        ]);

        $this->info("Test user created: {$user->email} with password: 1122");
        return 0;
    }
}