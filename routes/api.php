<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\VoiceController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\DeckController;
use App\Http\Controllers\LogController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

# Public
Route::post('/auth/verify', [AuthController::class, 'isLoggedIn']);

Route::group(['middleware' => ['guest', 'lang']], function() {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/register/verify', [AuthController::class, 'verifyEmail']);
    Route::post('/register/resend', [AuthController::class, 'resendVerificationEmail']);
    Route::post('/password/reset/request', [AuthController::class, 'requestPasswordReset']);
    Route::post('/password/reset', [AuthController::class, 'resetPassword']);
    Route::post('/password/reset/validate', [AuthController::class, 'validateResetPasswordToken']);
    Route::post('/login', [AuthController::class, 'login']);
});

# Private
Route::group(['middleware' => ['auth:sanctum', 'verified', 'lang']], function() {
    Route::post('/auth/verify', [AuthController::class, 'isLoggedIn']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/language', [LanguageController::class, 'index']);
    Route::get('/voice', [VoiceController::class, 'index']);
    Route::resource('deck', DeckController::class);
    Route::post('/card/bulk', [CardController::class, 'bulkStore']);
    Route::put('/card/bulk', [CardController::class, 'bulkUpdate']);
    Route::delete('/card/bulk', [CardController::class, 'bulkDestroy']);
    Route::resource('card', CardController::class);
    Route::resource('log', LogController::class);
});
