<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::resource('sync-table-config', App\Http\Controllers\SyncTableConfigController::class);
Route::resource('sync-table-time', App\Http\Controllers\SyncTimeConfigController::class);

Route::get('sync-control/consulting-execute/', [App\Http\Controllers\SyncControlController::class, 'consultingExecute']);
Route::resource('sync-table-control', App\Http\Controllers\SyncControlController::class);
