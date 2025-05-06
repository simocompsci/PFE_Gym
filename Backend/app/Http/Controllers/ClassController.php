<?php

namespace App\Http\Controllers;

use App\Models\GymClass;
use App\Models\Coach;
use App\Models\Gym;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassController extends Controller
{
    /**
     * Get all classes
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllClasses()
    {
        try {
            $classes = GymClass::with(['coach:id,first_name,last_name', 'gym:id,name'])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $classes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve classes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific class
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getClass($id)
    {
        try {
            $class = GymClass::with(['coach:id,first_name,last_name', 'gym:id,name'])
                ->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $class
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Class not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Create a new class
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createClass(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'description' => 'nullable|string',
                'coach_id' => 'required|exists:coaches,id',
                'gym_id' => 'required|exists:gyms,id',
                'max_capacity' => 'nullable|integer|min:1',
                'duration_minutes' => 'required|integer|min:5',
                'color_code' => 'nullable|string|max:7',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $class = GymClass::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Class created successfully',
                'data' => $class
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create class',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing class
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateClass(Request $request, $id)
    {
        try {
            $class = GymClass::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'string|max:100',
                'description' => 'nullable|string',
                'coach_id' => 'exists:coaches,id',
                'gym_id' => 'exists:gyms,id',
                'max_capacity' => 'nullable|integer|min:1',
                'duration_minutes' => 'integer|min:5',
                'color_code' => 'nullable|string|max:7',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $class->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Class updated successfully',
                'data' => $class
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update class',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a class
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteClass($id)
    {
        try {
            $class = GymClass::findOrFail($id);
            $class->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Class deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete class',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all coaches for dropdown
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCoaches()
    {
        try {
            $coaches = Coach::select('id', 'first_name', 'last_name')->get();

            return response()->json([
                'status' => 'success',
                'data' => $coaches
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve coaches',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
