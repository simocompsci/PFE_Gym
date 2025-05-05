<?php

namespace App\Http\Controllers;

use App\Models\Coach;
use App\Models\Secretary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class StaffController extends Controller
{
    public function getAllStaff()
    {
        try {
            // Fetch coaches and map them to the desired format
            $coaches = Coach::select('id', 'first_name', 'last_name', 'email', 'phone')
                ->get()
                ->map(function ($coach) {
                    return [
                        'id' => $coach->id,
                        'first_name' => $coach->first_name,
                        'last_name' => $coach->last_name,
                        'email' => $coach->email,
                        'phone' => $coach->phone,
                        'role' => 'Coach'
                    ];
                });

            // Fetch secretaries and map them to the desired format
            $secretaries = Secretary::select('id', 'first_name', 'last_name', 'email', 'phone')
                ->get()
                ->map(function ($secretary) {
                    return [
                        'id' => $secretary->id,
                        'first_name' => $secretary->first_name,
                        'last_name' => $secretary->last_name,
                        'email' => $secretary->email,
                        'phone' => $secretary->phone,
                        'role' => 'Secretary'
                    ];
                });

            // Merge both collections
            $allStaff = $coaches->concat($secretaries);

            return response()->json([
                'status' => 'success',
                'data' => $allStaff
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch staff data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createStaff(Request $request)
    {
        try {
            // Validate request data
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:coaches,email|unique:secretaries,email',
                'phone' => 'required|string|max:20',
                'password' => 'required|string|min:8',
                'role' => 'required|in:Coach,Secretary',
                'gym_id' => 'required|exists:gyms,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create staff based on role
            if ($request->role === 'Coach') {
                $staff = Coach::create([
                    'gym_id' => $request->gym_id,
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'password' => Hash::make($request->password),
                    'specialization' => $request->specialization ?? null,
                    'is_active' => true,
                    'hire_date' => now()->toDateString(),
                    'last_login' => now()
                ]);
            } else {
                $staff = Secretary::create([
                    'gym_id' => $request->gym_id,
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'password' => Hash::make($request->password),
                    'shift_schedule' => $request->shift_schedule ?? null,
                    'is_active' => true,
                    'hire_date' => now()->toDateString(),
                    'last_login' => now()
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Staff created successfully',
                'data' => [
                    'id' => $staff->id,
                    'first_name' => $staff->first_name,
                    'last_name' => $staff->last_name,
                    'email' => $staff->email,
                    'phone' => $staff->phone,
                    'role' => $request->role
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create staff',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateStaff(Request $request, $id)
    {
        try {
            // Validate request data
            $validator = Validator::make($request->all(), [
                'first_name' => 'sometimes|required|string|max:255',
                'last_name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email',
                'phone' => 'sometimes|required|string|max:20',
                'role' => 'required|in:Coach,Secretary',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Find the staff member based on role and ID
            if ($request->role === 'Coach') {
                $staff = Coach::findOrFail($id);

                // Check email uniqueness if it's being updated
                if ($request->has('email') && $request->email !== $staff->email) {
                    $emailExists = Coach::where('email', $request->email)
                        ->where('id', '!=', $id)
                        ->exists() ||
                        Secretary::where('email', $request->email)->exists();

                    if ($emailExists) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Email already in use'
                        ], 422);
                    }
                }
            } else {
                $staff = Secretary::findOrFail($id);

                // Check email uniqueness if it's being updated
                if ($request->has('email') && $request->email !== $staff->email) {
                    $emailExists = Secretary::where('email', $request->email)
                        ->where('id', '!=', $id)
                        ->exists() ||
                        Coach::where('email', $request->email)->exists();

                    if ($emailExists) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'Email already in use'
                        ], 422);
                    }
                }
            }

            // Update fields
            if ($request->has('first_name')) $staff->first_name = $request->first_name;
            if ($request->has('last_name')) $staff->last_name = $request->last_name;
            if ($request->has('email')) $staff->email = $request->email;
            if ($request->has('phone')) $staff->phone = $request->phone;

            // Role-specific fields
            if ($request->role === 'Coach' && $request->has('specialization')) {
                $staff->specialization = $request->specialization;
            } elseif ($request->role === 'Secretary' && $request->has('shift_schedule')) {
                $staff->shift_schedule = $request->shift_schedule;
            }

            // Update password if provided
            if ($request->has('password') && !empty($request->password)) {
                $staff->password = Hash::make($request->password);
            }

            $staff->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Staff updated successfully',
                'data' => [
                    'id' => $staff->id,
                    'first_name' => $staff->first_name,
                    'last_name' => $staff->last_name,
                    'email' => $staff->email,
                    'phone' => $staff->phone,
                    'role' => $request->role
                ]
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Staff not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update staff',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteStaff(Request $request, $id)
    {
        try {
            // Validate role
            $validator = Validator::make($request->all(), [
                'role' => 'required|in:Coach,Secretary',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Delete staff based on role
            if ($request->role === 'Coach') {
                $staff = Coach::findOrFail($id);
            } else {
                $staff = Secretary::findOrFail($id);
            }

            // Store name for response
            $name = $staff->first_name . ' ' . $staff->last_name;

            // Delete the staff member
            $staff->delete();

            return response()->json([
                'status' => 'success',
                'message' => "Staff member {$name} deleted successfully"
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Staff not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete staff',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
