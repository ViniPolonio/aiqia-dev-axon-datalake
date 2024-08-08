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
            $configs = SyncTableConfig::whereNull('deleted_at')->get();

            if ($configs->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ], 204);
            }

            $response = app(SyncControlController::class)->consultingExecute();
            $responseData = json_decode($response->getContent(), true);

            if ($responseData['status'] != 1) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Error while retrieving sync control data.'
                ], 500);
            }

            $syncControlData = collect($responseData['data']);
            $data = [];

            foreach ($configs as $config) {
                $syncData = $syncControlData->firstWhere('sync_table_config_id', $config->id);
                $data[] = [
                    'sync_table_config_id' => $config->id,
                    'config_data' => $config,
                    'sync_control_data' => $syncData
                ];
            }

            return response()->json([
                'data' => $data
            ], 200);
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
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
            $syncTableConfig->active = 1;
            $syncTableConfig->save();
            
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
