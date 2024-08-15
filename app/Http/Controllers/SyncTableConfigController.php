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
            $syncControlData = collect($response);
            $data = [];

            foreach ($configs as $config) {
                $syncData = $syncControlData->firstWhere('sync_table_config_id', $config->id);

                if ($syncData) {
                    $configData['sync_table_config_id'] = $syncData['sync_table_config_id'];
                    $configData['success'] = $syncData['success'];
                    $configData['finished_at'] = $syncData['finished_at'];
                    $success = 1;
                } else {
                    $success = 2;
                }
                $configData = [
                    'id'                => $config->id,
                    'oracle_name'       => $config->oracle_name,
                    'mysql_name'        => $config->mysql_name,
                    'active'            => $config->active,
                    'created_at'        => $config->created_at,
                    'updated_at'        => $config->updated_at,
                    'deleted_at'        => $config->deleted_at,
                    'field_check_name'  => $config->field_check_name,
                    'uniq_fields_name'  => $config->uniq_fields_name,
                    'success'           => $success, //Registro na tabela SyncControl || 0-Erro | 1-Sucesso | 2-Não possui registro na tabela.
                    'finished_at'       => $configData['finished_at']
                ];

                $data[] = [
                    'sync_table_config_id' => $config->id,
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
            if (!is_numeric($id)) {
                return response()->json([
                    'status'   => 0,    
                    'message'  => "The ID number is not valid"
                ], 400);
            }
            
            $syncTableConfig = SyncTableConfig::findOrFail($id);

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
            
            $syncTableConfig = SyncTableConfig::findOrFail($id);

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
