<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncConfig\SyncTableConfigCreateRequest;
use App\Http\Requests\SyncConfig\SyncTableConfigUpdateRequest;
use App\Models\SyncTableConfig;
use Illuminate\Http\Request;

class SyncTableConfigController extends Controller
{
    public function index() 
    {
        try {
            $return = SyncTableConfig::whereNull('deleted_at')->get();

            if(!$return) {
                return response()->json([
                    'status' => 0,
                    'mesasage' => 'No records found.'
                ],204);
            }
            return response()->json([
                'status' => 1,
                'data' => $return
            ],200);
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Erro has been occurred' . $e->getMessage()
            ],500);
        }
    }

    public function show($id) 
    {
        try {
            if (empty($id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'ID is required.'
                ], 400); 
            }
    
            $return = SyncTableConfig::find($id);
    
            if (!$return) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ], 404); 
            }
    
            return response()->json([
                'status' => 1,
                'data' => $return
            ], 200);
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(SyncTableConfigCreateRequest $request) 
    {
        try {
            $syncTableConfig = SyncTableConfig::create($request->validated());
    
            if ($syncTableConfig && $syncTableConfig->id) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Record created successfully.',
                    'data' => $syncTableConfig
                ], 200);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'Failed to create record.'
                ], 500);
            }
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(SyncTableConfigUpdateRequest $request, $id) 
    {
        try {
            if (empty($id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'ID is required.'
                ], 400); 
            }
    
            $updated = SyncTableConfig::where('id', $id)
                ->update($request->validated());

            if ($updated) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Record updated successfully.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found to update.'
                ], 404);
            }
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id) 
    {
        try {
            if (empty($id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'ID is required.'
                ], 400); 
            }
    
            $return = SyncTableConfig::find($id);

    
            if (!$return) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ], 404); 
            }

            $return->delete();

            return response()->json([
                'status' => 1,
                'message' => 'Record deleted successfully',
                'data' => $return
            ], 200);
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}
