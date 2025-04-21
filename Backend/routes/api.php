<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\mutli_Auth_Controller;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CoachController;
use App\Http\Controllers\SecretaryController;

// Public routes
Route::post('/login', [mutli_Auth_Controller::class, 'login']);
Route::post('/register', [mutli_Auth_Controller::class, 'register']);

// Protected routes with specific abilities
Route::middleware(['auth:sanctum', 'ability:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    // Other admin routes
});

Route::middleware(['auth:sanctum', 'ability:coach'])->prefix('coach')->group(function () {
    Route::get('/dashboard', [CoachController::class, 'dashboard']);
    // Other coach routes
});

Route::middleware(['auth:sanctum', 'ability:secretary'])->prefix('secretary')->group(function () {
    Route::get('/dashboard', [SecretaryController::class, 'dashboard']);
    // Other secretary routes
});

// Shared authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [mutli_Auth_Controller::class, 'logout']);
    Route::get('/user', [mutli_Auth_Controller::class, 'user']);
});