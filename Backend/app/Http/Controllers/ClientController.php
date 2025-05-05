<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ClientMembership;
use App\Models\MembershipPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    /**
     * Get all clients with their active membership
     */
    public function getAllClients()
    {
        try {
            $clients = Client::with(['memberships' => function($query) {
                $query->where('status', 'active')
                    ->orderBy('end_date', 'desc')
                    ->limit(1);
            }, 'memberships.plan'])
            ->get()
            ->map(function($client) {
                $activeMembership = $client->memberships->first();
                
                return [
                    'id' => $client->id,
                    'name' => $client->first_name . ' ' . $client->last_name,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'membership' => $activeMembership ? $activeMembership->plan->name : 'None',
                    'active' => $client->is_active,
                    'join_date' => $client->join_date,
                    'membership_end_date' => $activeMembership ? $activeMembership->end_date : null
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $clients
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch clients data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific client with their memberships
     */
    public function getClient($id)
    {
        try {
            $client = Client::with(['memberships.plan'])->findOrFail($id);
            
            $activeMembership = $client->memberships()
                ->where('status', 'active')
                ->orderBy('end_date', 'desc')
                ->first();
            
            $clientData = [
                'id' => $client->id,
                'first_name' => $client->first_name,
                'last_name' => $client->last_name,
                'name' => $client->first_name . ' ' . $client->last_name,
                'email' => $client->email,
                'phone' => $client->phone,
                'birth_date' => $client->birth_date,
                'gender' => $client->gender,
                'address' => $client->address,
                'join_date' => $client->join_date,
                'notes' => $client->notes,
                'active' => $client->is_active,
                'membership' => $activeMembership ? $activeMembership->plan->name : 'None',
                'membership_id' => $activeMembership ? $activeMembership->id : null,
                'membership_end_date' => $activeMembership ? $activeMembership->end_date : null,
                'membership_status' => $activeMembership ? $activeMembership->status : null
            ];

            return response()->json([
                'status' => 'success',
                'data' => $clientData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch client data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new client
     */
    public function createClient(Request $request)
    {
        try {
            // Validate request data
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:50',
                'last_name' => 'required|string|max:50',
                'email' => 'nullable|email|unique:clients,email',
                'phone' => 'required|string|max:20',
                'membership' => 'required|string|exists:membership_plans,name',
                'gym_id' => 'required|exists:gyms,id',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Start a database transaction
            DB::beginTransaction();

            // Create the client
            $client = Client::create([
                'gym_id' => $request->gym_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'birth_date' => $request->birth_date,
                'gender' => $request->gender,
                'address' => $request->address,
                'join_date' => $request->join_date ?? now()->toDateString(),
                'notes' => $request->notes,
                'is_active' => $request->is_active ?? true
            ]);

            // Find the membership plan
            $membershipPlan = MembershipPlan::where('name', $request->membership)->first();
            
            if ($membershipPlan) {
                // Calculate end date based on duration_days
                $startDate = now()->toDateString();
                $endDate = now()->addDays($membershipPlan->duration_days)->toDateString();
                
                // Create client membership
                ClientMembership::create([
                    'client_id' => $client->id,
                    'membership_plan_id' => $membershipPlan->id,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'status' => 'active',
                    'auto_renew' => false,
                    'payment_method' => $request->payment_method ?? 'Cash'
                ]);
            }

            // Commit the transaction
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Client created successfully',
                'data' => [
                    'id' => $client->id,
                    'name' => $client->first_name . ' ' . $client->last_name,
                    'email' => $client->email,
                    'phone' => $client->phone,
                    'membership' => $request->membership,
                    'active' => $client->is_active
                ]
            ], 201);
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing client
     */
    public function updateClient(Request $request, $id)
    {
        try {
            // Validate request data
            $validator = Validator::make($request->all(), [
                'first_name' => 'sometimes|required|string|max:50',
                'last_name' => 'sometimes|required|string|max:50',
                'email' => 'nullable|email|unique:clients,email,' . $id,
                'phone' => 'sometimes|required|string|max:20',
                'membership' => 'sometimes|required|string|exists:membership_plans,name',
                'is_active' => 'boolean'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Find the client
            $client = Client::findOrFail($id);

            // Start a database transaction
            DB::beginTransaction();

            // Update client fields
            if ($request->has('first_name')) $client->first_name = $request->first_name;
            if ($request->has('last_name')) $client->last_name = $request->last_name;
            if ($request->has('email')) $client->email = $request->email;
            if ($request->has('phone')) $client->phone = $request->phone;
            if ($request->has('birth_date')) $client->birth_date = $request->birth_date;
            if ($request->has('gender')) $client->gender = $request->gender;
            if ($request->has('address')) $client->address = $request->address;
            if ($request->has('notes')) $client->notes = $request->notes;
            if ($request->has('is_active')) $client->is_active = $request->is_active;
            
            $client->save();

            // Update membership if provided
            if ($request->has('membership')) {
                $membershipPlan = MembershipPlan::where('name', $request->membership)->first();
                
                if ($membershipPlan) {
                    // Check if there's an active membership
                    $activeMembership = $client->memberships()
                        ->where('status', 'active')
                        ->first();
                    
                    if ($activeMembership) {
                        // If the membership plan is different, update it
                        if ($activeMembership->membership_plan_id != $membershipPlan->id) {
                            // Set the old membership as expired
                            $activeMembership->status = 'expired';
                            $activeMembership->save();
                            
                            // Create a new membership
                            $startDate = now()->toDateString();
                            $endDate = now()->addDays($membershipPlan->duration_days)->toDateString();
                            
                            ClientMembership::create([
                                'client_id' => $client->id,
                                'membership_plan_id' => $membershipPlan->id,
                                'start_date' => $startDate,
                                'end_date' => $endDate,
                                'status' => 'active',
                                'auto_renew' => false,
                                'payment_method' => $request->payment_method ?? 'Cash'
                            ]);
                        }
                    } else {
                        // Create a new membership if there's no active one
                        $startDate = now()->toDateString();
                        $endDate = now()->addDays($membershipPlan->duration_days)->toDateString();
                        
                        ClientMembership::create([
                            'client_id' => $client->id,
                            'membership_plan_id' => $membershipPlan->id,
                            'start_date' => $startDate,
                            'end_date' => $endDate,
                            'status' => 'active',
                            'auto_renew' => false,
                            'payment_method' => $request->payment_method ?? 'Cash'
                        ]);
                    }
                }
            }

            // Commit the transaction
            DB::commit();

            // Get the updated client with active membership
            $updatedClient = Client::with(['memberships' => function($query) {
                $query->where('status', 'active')
                    ->orderBy('end_date', 'desc')
                    ->limit(1);
            }, 'memberships.plan'])->find($id);
            
            $activeMembership = $updatedClient->memberships->first();

            return response()->json([
                'status' => 'success',
                'message' => 'Client updated successfully',
                'data' => [
                    'id' => $updatedClient->id,
                    'name' => $updatedClient->first_name . ' ' . $updatedClient->last_name,
                    'email' => $updatedClient->email,
                    'phone' => $updatedClient->phone,
                    'membership' => $activeMembership ? $activeMembership->plan->name : 'None',
                    'active' => $updatedClient->is_active
                ]
            ], 200);
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a client
     */
    public function deleteClient($id)
    {
        try {
            $client = Client::findOrFail($id);
            $clientName = $client->first_name . ' ' . $client->last_name;
            
            // Delete the client (this will cascade delete memberships due to foreign key constraint)
            $client->delete();

            return response()->json([
                'status' => 'success',
                'message' => "Client {$clientName} deleted successfully"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete client',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all membership plans
     */
    public function getMembershipPlans()
    {
        try {
            $plans = MembershipPlan::where('is_active', true)->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $plans
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch membership plans',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
