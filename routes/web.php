<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DeckController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('main');
});

Route::get('/login', function () {
    return view('main');
})->name('login');

Route::group(['middleware' => ['lang']], function() {
    Route::get('/deck/{id}/play', [DeckController::class, 'web']);
});

Route::any('{all}', function () {
    return view('main');
})->where('all', '^((?!api).)*');
