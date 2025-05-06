<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\mutli_Auth_Controller;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\SecretaryController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ProductController;

// Public routes
Route::post('/login', [mutli_Auth_Controller::class, 'login']);
Route::post('/register', [mutli_Auth_Controller::class, 'register']);

// Protected routes with specific abilities
Route::middleware(['auth:sanctum', 'abilities:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // Staff routes
    Route::get('/staff', [StaffController::class, 'getAllStaff']);
    Route::post('/staff', [StaffController::class, 'createStaff']);
    Route::put('/staff/{id}', [StaffController::class, 'updateStaff']);
    Route::delete('/staff/{id}', [StaffController::class, 'deleteStaff']);

    // Client routes
    Route::get('/clients', [ClientController::class, 'getAllClients']);
    Route::get('/clients/{id}', [ClientController::class, 'getClient']);
    Route::post('/clients', [ClientController::class, 'createClient']);
    Route::put('/clients/{id}', [ClientController::class, 'updateClient']);
    Route::delete('/clients/{id}', [ClientController::class, 'deleteClient']);
    Route::get('/membership-plans', [ClientController::class, 'getMembershipPlans']);

    // Class routes
    Route::get('/classes', [ClassController::class, 'getAllClasses']);
    Route::get('/classes/{id}', [ClassController::class, 'getClass']);
    Route::post('/classes', [ClassController::class, 'createClass']);
    Route::put('/classes/{id}', [ClassController::class, 'updateClass']);
    Route::delete('/classes/{id}', [ClassController::class, 'deleteClass']);
    Route::get('/coaches-list', [ClassController::class, 'getCoaches']);

    // Product routes
    Route::get('/products', [ProductController::class, 'getAllProducts']);
    Route::get('/products/{id}', [ProductController::class, 'getProduct']);
    Route::post('/products', [ProductController::class, 'createProduct']);
    Route::put('/products/{id}', [ProductController::class, 'updateProduct']);
    Route::delete('/products/{id}', [ProductController::class, 'deleteProduct']);
    Route::get('/product-categories', [ProductController::class, 'getCategories']);

    // Other admin routes
});

Route::middleware(['auth:sanctum', 'abilities:coach'])->prefix('coach')->group(function () {
    Route::get('/dashboard', [CoachController::class, 'dashboard']);
    // Other coach routes
});

Route::middleware(['auth:sanctum', 'abilities:secretary'])->prefix('secretary')->group(function () {
    Route::get('/dashboard', [SecretaryController::class, 'dashboard']);
    // Other secretary routes
});

// Shared authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [mutli_Auth_Controller::class, 'logout']);
    Route::get('/user', [mutli_Auth_Controller::class, 'user']);
});





