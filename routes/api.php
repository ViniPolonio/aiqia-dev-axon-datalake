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

//Sync Control Logs
Route::resource('sync-control-logs', App\Http\Controllers\SyncControlLogsController::class);
Route::get('sync-control/return-show-tableconfig/{id}', [App\Http\Controllers\SyncControlLogsController::class, 'returnShowTableConfig']);

//Sync Control Config
Route::resource('sync-control-config', App\Http\Controllers\SyncControlConfigController::class);
Route::put('sync-control-config-activeOrDesactive/{id}', [App\Http\Controllers\SyncControlConfigController::class, 'acTiveOrDesactive']);

//Sync Control Time
Route::resource('sync-control-time', App\Http\Controllers\SyncControlTimeConfigController::class);

