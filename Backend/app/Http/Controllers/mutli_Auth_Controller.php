<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Coach;
use App\Models\Secretary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class mutli_Auth_Controller extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'user_type' => 'required|in:admin,coach,secretary',
        ]);

        $userType = $request->user_type;
        $guard = $userType;

        // Determine model based on user type
        $model = match($userType) {
            'admin' => Admin::class,
            'coach' => Coach::class,
            'secretary' => Secretary::class,
        };

        $user = $model::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Create token with user type as ability
        $token = $user->createToken('auth_token', [$userType])->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user_type' => $userType,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
    
    public function register(Request $request)
    {
        // Validate common fields
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => ['required', 'confirmed', Password::defaults()],
            'user_type' => 'required|in:admin,coach,secretary',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $userType = $request->user_type;
        
        // Check if email already exists in the respective table
        $model = match($userType) {
            'admin' => Admin::class,
            'coach' => Coach::class,
            'secretary' => Secretary::class,
        };
        
        if ($model::where('email', $request->email)->exists()) {
            return response()->json([
                'message' => 'Email already exists for this user type'
            ], 422);
        }
        
        // Create user based on user_type
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ];
        
        // Add any type-specific fields
        if ($userType === 'coach' && isset($request->specialization)) {
            $userData['specialization'] = $request->specialization;
        }
        
        if ($userType === 'secretary' && isset($request->department)) {
            $userData['department'] = $request->department;
        }
        
        // Create the user
        $user = $model::create($userData);
        
        // Generate token
        $token = $user->createToken('auth_token', [$userType])->plainTextToken;
        
        return response()->json([
            'message' => 'Registration successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user_type' => $userType,
            'user' => $user
        ], 201);
    }
}