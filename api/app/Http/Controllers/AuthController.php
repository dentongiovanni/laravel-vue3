<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Login user and return a personal access token.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to authenticate
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Retrieve the authenticated user
        $user = Auth::user();

        // Create a personal access token
        // The 'auth_token' can be any name you want for this token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Logged in successfully',
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    /**
     * Logout user (invalidate all tokens).
     */
    public function logout(Request $request)
    {
        // Revoke all tokens the user has
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
