<?php

namespace App\Http\Controllers;
use App\Http\Requests\SyncConfig\SyncTimeConfigCreateRequest;
use App\Http\Requests\SyncConfig\SyncTimeConfigUpdateRequest;
use App\Models\SyncTableConfig;
use App\Models\SyncTimeConfig;


class SyncTimeConfigController extends Controller
{
    public function index() {
        try {
            $return = SyncTimeConfig::whereNull('deleted_at')->get();

            if(!$return) {
                return response()->json([
                    'status'  => 0,
                    'mesasage' => 'No records found.'
                ],204);
            }

            return response()->json([
                'status' => 1,
                'message' => $return
            ],200);

        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Error has been occurred' . $e->getMessage()
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
            $return = SyncTimeConfig::where('sync_table_config_id', '=', $id)->get();

            if(!$return) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ],204);
            }

            return response()->json([
                'status' => 1,
                'message' => $return
            ],200);
        } 
        catch(\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Error has been occurred' . $e->getMessage()
            ],500);
        }
    }

    public function store(SyncTimeConfigCreateRequest $request) 
    {
        try {
            $syncTableConfig = SyncTableConfig::find($request->input('sync_table_config_id'));

            if (!$syncTableConfig) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Sync table config ID not exists.'
                ], 404); 
            }

            $syncTime = SyncTimeConfig::create($request->validated());

            if ($syncTime && $syncTime->id) {
                return response()->json([
                    'status' => 1,
                    'message' => 'Record created successfully.',
                    'data' => $syncTime
                ], 201); 
            } else {
                return response()->json([
                    'status' => 0,
                    'message' => 'Failed to create record.'
                ], 500); 
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500); 
        }
    }

    public function update(SyncTimeConfigUpdateRequest $request, $id) 
    {
        try {
            $syncTableConfig = SyncTableConfig::find($request->input('sync_table_config_id'));

            if (empty($id)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'ID is required.'
                ], 400); 
            }

            if (!$syncTableConfig) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Sync table config ID does not exist.'
                ], 404); 
            }

            $syncTimeConfig = SyncTimeConfig::findOrFail($id);

            if (!$syncTimeConfig) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Sync time config ID not found.'
                ], 404); 
            }

            $updated = $syncTimeConfig->update($request->validated());

            if ($updated) {
                return response()->json([
                    'status'   => 1,
                    'message'  => "Operation success",
                    'data'     => $syncTimeConfig 
                ], 200);
            } else {
                return response()->json([
                    'status'   => 0,
                    'message'  => "Error during the operation",
                ], 500);
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
    
            $return = SyncTimeConfig::find($id);

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