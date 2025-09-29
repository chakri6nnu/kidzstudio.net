<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{

    public function toResponse($request)
    {
        // If this is an API request, return JSON (for token-based auth)
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'message' => 'Authenticated successfully',
                'user' => Auth::user(),
            ]);
        }

        // Otherwise, redirect to dashboard based on role (for web auth)
        if(Auth::user()->hasRole("admin"))
            return redirect()->route('admin_dashboard');
        return redirect()->intended(config('fortify.home'));
    }

}
