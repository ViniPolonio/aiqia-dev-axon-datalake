<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncConfig\SyncControlConfigCreateRequest;
use App\Http\Requests\SyncConfig\SyncControlConfigUpdateRequest;
use App\Models\SyncControlConfig;
use App\Models\SyncControlLog;
use App\Models\SyncControlTimeConfig;
use Illuminate\Http\Request;
class SyncControlConfigController extends Controller
{
    public function index() 
    {
        try {
            $configs = SyncControlConfig::whereNull('deleted_at')->get();
            $ids = $configs->pluck('id');

            $consultTimeConfig = $this->consultTimer($ids);

            if (isset($consultTimeConfig['status']) && $consultTimeConfig['status'] == 0) {
                return response()->json([
                    'status' => 0,
                    'message' => $consultTimeConfig['message']
                ], 404); 
            }

            $consultTimeConfig = collect($consultTimeConfig);

            if ($configs->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ], 204);
            }

            $data = [];

            foreach ($configs as $config) {
                if (is_null($config->process_name)) {
                    continue;
                }

                $lastLog = SyncControlLog::where('sync_control_config_id', $config->id)
                    ->orderBy('finished_at', 'desc')
                    ->select(['sync_control_config_id', 'success', 'runtime_second', 'finished_at', 'error'])
                    ->first();

                $logs = SyncControlLog::where('sync_control_config_id', $config->id)
                    ->orderBy('finished_at', 'desc')
                    ->take(20)
                    ->select(['sync_control_config_id', 'success', 'runtime_second', 'finished_at', 'error'])
                    ->get()
                    ->map(function ($log) {
                        return [
                            'success' => $log->success,
                            'runtime_second' => $log->runtime_second,
                            'finished_at' => $log->finished_at,
                            'error' => $log->error ?? null,
                        ];
                    })
                    ->values()
                    ->toArray();

                $configTime = $consultTimeConfig->firstWhere('sync_control_config_id', $config->id);

                $intervalDescription = 'No timer configured';
                $success = 2;

                if ($configTime) {
                    $intervalType = $configTime['interval_type'];
                    $intervalValue = $configTime['interval_value'];
                    $intervalDescription = $configTime['interval_description'];

                    $intervalInMinutes = match ($intervalType) {
                        1 => $intervalValue,            
                        2 => $intervalValue * 60,       
                        3 => $intervalValue * 1440,     
                        default => null,                
                    };

                    if ($intervalInMinutes && $lastLog) {
                        $timeDifference = \Carbon\Carbon::now()->diffInMinutes(\Carbon\Carbon::parse($lastLog->finished_at));

                        if ($timeDifference > $intervalInMinutes) {
                            $lastLog->success = 0;  
                        }
                    }
                }

                if ($lastLog) {
                    $success = $lastLog->success == 1 ? 1 : 0; 
                } else {
                    $success = 0;
                }

                $configData = [
                    'id'            => $config->id,
                    'process_name'  => $config->process_name,
                    'active'        => $config->active,
                    'created_at'    => $config->created_at,
                    'updated_at'    => $config->updated_at,
                    'deleted_at'    => $config->deleted_at,
                    'activated_based_timer' => $success,  
                    'interval_description' => $intervalDescription
                ];

                $data[] = [
                    'sync_control_config_id' => $config->id,
                    'config_data' => $configData,
                    'logs' => !empty($logs) ? $logs : null,
                ];
            }

            return response()->json([
                'status' => 1,
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }


    public function orderIds($configs) {
        try {
            $configs = collect($configs);
            $orderedConfigs = $configs->sortBy('id');
            $ids = [];

            foreach ($orderedConfigs as $config) {
                $ids[] = $config['id']; 
            }

            return $ids;

        } catch (\Exception $e) {
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

            $consultTimeConfig = collect($this->consultTimer([$id])); 

            $syncControl = app(SyncControlLogsController::class)->returnShowTableConfig($id);
            $finishedAt = $syncControl ? $syncControl->finished_at : null;

            $return = SyncControlConfig::find($id);

            if (!$return) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ], 404); 
            }

            if ($finishedAt && $consultTimeConfig) {
                $configTime = $consultTimeConfig->firstWhere('sync_control_config_id', $id);
                if ($configTime) {
                    $intervalType = $configTime['interval_type'];
                    $intervalValue = $configTime['interval_value'];
                    $intervalDescription = $configTime['interval_description'];

                    $intervalInMinutes = match ($intervalType) {
                        1 => $intervalValue,            
                        2 => $intervalValue * 60,       
                        3 => $intervalValue * 1440,     
                        default => null,                
                    };

                    if ($intervalInMinutes) {
                        $timeDifference = \Carbon\Carbon::now()->diffInMinutes(\Carbon\Carbon::parse($finishedAt));

                        if ($timeDifference > $intervalInMinutes) {
                            return response()->json([
                                'status' => 0,
                                'data' => $return,
                                'finished_at' => $finishedAt,
                                'interval_description' => $intervalDescription,
                            ], 200);
                        }
                    }
                }
            }

            return response()->json([
                'status' => 1,
                'data' => $return,
                'finished_at' => $finishedAt,
                'interval_description' => $intervalDescription,
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

    public function consultTimer($ids) {
        $consultTimeConfig = SyncControlTimeConfig::whereIn('sync_control_config_id', $ids)
            ->where('active', 1)
            ->get();
    
    
        $arrayFormated = $consultTimeConfig->map(function ($item) {
            $intervalTypes = [
                1 => 'minuto(s)',
                2 => 'hora(s)',
                3 => 'dia(s)',
            ];
    
            $intervalTypeDescription = isset($intervalTypes[$item->interval_type]) 
                ? $intervalTypes[$item->interval_type] 
                : 'desconhecido';
    
            return [
                'sync_control_config_id' => $item->sync_control_config_id,
                'interval_description' => $item->interval_value . ' ' . $intervalTypeDescription,
                'interval_type' => $item->interval_type,
                'interval_value' => $item->interval_value,
                'active' => $item->active,
            ];
        });

        return $arrayFormated->toArray(); 
    }
    
}
    