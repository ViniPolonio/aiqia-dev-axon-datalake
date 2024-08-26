<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncConfig\SyncControlConfigCreateRequest;
use App\Http\Requests\SyncConfig\SyncControlConfigUpdateRequest;
use App\Models\SyncControlConfig;
use Illuminate\Http\Request;
class SyncControlConfigController extends Controller
{
    public function index() 
    {
        try {
            $configs = SyncControlConfig::whereNull('deleted_at')->get();

            if ($configs->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ], 204);
            }

            $response = app(SyncControlLogsController::class)->consultingExecute();
            $syncControlData = collect($response);
            $data = [];

            foreach ($configs as $config) {
                $syncData = $syncControlData->firstWhere('sync_control_config_id', $config->id);

                if ($syncData) {
                    $configData['sync_control_config_id'] = $syncData['sync_control_config_id'];
                    $configData['success'] = $syncData['success'];
                    $configData['finished_at'] = $syncData['finished_at'];
                    $configData['process_name'] = $syncData['process_name'];
                    $success = 1;
                } else {
                    $success = 2;
                }
                $configData = [
                    'id'                => $config->id,
                    'process_name'      => $config->process_name,
                    'active'            => $config->active,
                    'created_at'        => $config->created_at,
                    'updated_at'        => $config->updated_at,
                    'deleted_at'        => $config->deleted_at,
                    'success'           => $success, //Registro na tabela SyncControl || 0-Erro | 1-Sucesso | 2-Não possui registro na tabela.
                    'finished_at'       => $configData['finished_at']
                ];

                $data[] = [
                    'sync_control_config_id' => $config->id,
                    'config_data' => $configData,
                ];
            }
            return response()->json([
                'data'      => $data
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

            $syncControl = app(SyncControlLogsController::class)->returnShowTableConfig($id);
            $finishedAt = $syncControl ? $syncControl->finished_at : null;

            $return = SyncControlConfig::find($id);
        
            if (!$return) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ], 404); 
            }

            return response()->json([
                'status' => 1,
                'data' => $return,
                'finished_at' => $finishedAt 
            ], 200);
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }


    public function store(SyncControlConfigCreateRequest $request) 
    {
        try {
            $syncTableConfig = SyncControlConfig::create($request->validated());
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

    public function update(SyncControlConfigUpdateRequest $request, $id) 
    {
        try {
            if (!is_numeric($id)) {
                return response()->json([
                    'status'   => 0,    
                    'message'  => "The ID number is not valid"
                ], 400);
            }
            
            $syncTableConfig = SyncControlConfig::findOrFail($id);

            $updateSuccessful = $syncTableConfig->update($request->validated());

            if ($updateSuccessful) {
                return response()->json([
                    'status'   => 1,
                    'message'  => "Operation success",
                    'data'     => $syncTableConfig
                ], 200);
            } else {
                return response()->json([
                    'status'   => 0,
                    'message'  => "Error during the operation",
                ], 500);
            }
        } catch (\Exception $e) {
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
    
            $return = SyncControlConfig::find($id);

    
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

    public function acTiveOrDesactive($id, Request $request) {
        
        try {
            $validatedData = $request->validate([
                'active' => 'required|integer'
            ]);
            
            if (!is_numeric($id)) {
                return response()->json([
                    'status'   => 0,    
                    'message'  => "The ID number is not valid"
                ], 400);
            }
            $syncTableConfig = SyncControlConfig::findOrFail($id);

            $updateSuccessful = $syncTableConfig->update([
                'active' => $validatedData['active']
            ]);

            if ($updateSuccessful) {
                return response()->json([
                    'status'   => 1,
                    'message'  => "Operation success",
                    'data'     => $syncTableConfig
                ], 200);
            } else {
                return response()->json([
                    'status'   => 0,
                    'message'  => "Error during the operation",
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 0,
                'message' => 'Error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}