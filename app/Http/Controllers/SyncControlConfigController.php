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

                // Obtenha o último log concluído
                $lastLog = SyncControlLog::where('sync_control_config_id', $config->id)
                    ->whereNotNull('finished_at')
                    ->where('finished_at', '!=', '')
                    ->orderBy('finished_at', 'desc')
                    ->select(['sync_control_config_id', 'success', 'runtime_second', 'finished_at', 'error'])
                    ->first();

                // Obtenha a lista de logs (últimos 20)
                $logs = SyncControlLog::where('sync_control_config_id', $config->id)
                    ->whereNotNull('finished_at')
                    ->where('finished_at', '!=', '')
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

                $configTime = $consultTimeConfig->where('sync_control_config_id', $config->id)->first();

                // Verifica os valores de intervalo
                $intervalDays = $configTime['interval_days']['value'] ?? 0;
                $intervalHours = $configTime['interval_hours']['value'] ?? 0;
                $intervalMinutes = $configTime['interval_minutes']['value'] ?? 0;

                // Variável que determina o status do intervalo
                $statusDays = 'inactive'; 
                $statusHours = 'inactive';
                $statusMinutes = 'inactive';

                // Se houver um log concluído, calcula a diferença de tempo
                if ($lastLog) {
                    $finishedAt = \Carbon\Carbon::parse($lastLog->finished_at);
                    $now = \Carbon\Carbon::now();
                    $timeDifference = $now->diffInMinutes($finishedAt);

                    //Para facilitar o calculo, tudo e convertido para minutos
                    if ($intervalMinutes > 0 && $timeDifference <= $intervalMinutes) {
                        $statusMinutes = 'active'; 
                    }

                    if ($intervalHours > 0) {
                        $intervalInMinutes = $intervalHours * 60; 
                        if ($timeDifference <= $intervalInMinutes) {
                            $statusHours = 'active'; 
                        }
                    }

                    if ($intervalDays > 0) {
                        $intervalInMinutes = $intervalDays * 1440; 
                        if ($timeDifference <= $intervalInMinutes) {
                            $statusDays = 'active';
                        }
                    }
                }

                $configData = [
                    'id'            => $config->id,
                    'process_name'  => $config->process_name,
                    'active'        => $config->active,
                    'created_at'    => $config->created_at,
                    'updated_at'    => $config->updated_at,
                    'deleted_at'    => $config->deleted_at,
                    'interval_in_minutes' => [
                        'value'  => $intervalMinutes,
                        'status' => $statusMinutes,
                    ],
                    'interval_in_days' => [
                        'value'  => $intervalDays,
                        'status' => $statusDays
                    ],
                    'interval_in_hours' => [
                        'value'  => $intervalHours,
                        'status' => $statusHours
                    ],
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

    public function orderIds($configs) 
    {
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

            if ($consultTimeConfig->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No interval configurations found.'
                ], 404); 
            }

            $interval = $consultTimeConfig->first(); 

            $return = SyncControlConfig::find($id);

            if (!$return) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No records found.'
                ], 404); 
            }

            $syncControlLog = SyncControlLog::where('sync_control_time_config_id', $interval['interval_days']['id'])
                ->orWhere('sync_control_time_config_id', $interval['interval_hours']['id'])
                ->orWhere('sync_control_time_config_id', $interval['interval_minutes']['id'])
                ->where('sync_control_config_id', $id)
                ->first();

            $finishedAt = $syncControlLog ? $syncControlLog->finished_at : null;

            $now = now();
            $timeDifference = $now->diffInMinutes($finishedAt);
            //É feito uma conversão de o valor vezes minutos para facilitar a comparação de activo inactivo
            $intervalInMinutes = $interval['interval_minutes']['value'] ?? 0;
            $intervalInHours = ($interval['interval_hours']['value'] ?? 0) * 60; 
            $intervalInDays = ($interval['interval_days']['value'] ?? 0) * 1440; 

            $minutesStatus = ($timeDifference < $intervalInMinutes) ? 'active' : 'inactive';
            $hoursStatus = ($timeDifference < $intervalInHours) ? 'active' : 'inactive';
            $daysStatus = ($timeDifference < $intervalInDays) ? 'active' : 'inactive';

            $return->interval_in_minutes = [
                'value'  => $interval['interval_minutes']['value'],
                'status' => $minutesStatus,
            ];
            $return->interval_in_days = [
                'value'  => $interval['interval_days']['value'],
                'status' => $daysStatus
            ];
            $return->interval_in_hours = [
                'value'  => $interval['interval_hours']['value'],
                'status' => $hoursStatus
            ];

            return response()->json([
                'status' => 1,
                'data' => [
                    'id' => $return->id,
                    'process_name' => $return->process_name,
                    'active' => $return->active,
                    'created_at' => $return->created_at,
                    'updated_at' => $return->updated_at,
                    'deleted_at' => $return->deleted_at,
                    'interval_in_minutes' => $return->interval_in_minutes,
                    'interval_in_days' => $return->interval_in_days,
                    'interval_in_hours' => $return->interval_in_hours
                ],
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

    public function acTiveOrDesactive($id, Request $request) 
    {
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

    public function consultTimer($ids) 
    {
        $consultTimeConfig = SyncControlTimeConfig::whereIn('sync_control_config_id', $ids)
            ->where('active', 1)
            ->get();

        $arrayGrouped = $consultTimeConfig->groupBy('sync_control_config_id')->map(function ($group) {
            $intervalSum = [
                'dias' => ['valor' => 0, 'id' => 0],
                'horas' => ['valor' => 0, 'id' => 0],
                'minutos' => ['valor' => 0, 'id' => 0],
            ];

            foreach ($group as $item) {
                if ($item->interval_type == 3) { // Dias
                    $intervalSum['dias']['valor'] += $item->interval_value;
                    $intervalSum['dias']['id'] = $item->id; // Armazena o id do intervalo de dias
                } elseif ($item->interval_type == 2) { // Horas
                    $intervalSum['horas']['valor'] += $item->interval_value;
                    $intervalSum['horas']['id'] = $item->id; // Armazena o id do intervalo de horas
                } elseif ($item->interval_type == 1) { // Minutos
                    $intervalSum['minutos']['valor'] += $item->interval_value;
                    $intervalSum['minutos']['id'] = $item->id; // Armazena o id do intervalo de minutos
                }
            }

            return [
                'sync_control_config_id' => $group->first()->sync_control_config_id,
                'interval_days' => [
                    'id' => $intervalSum['dias']['id'],
                    'value' => $intervalSum['dias']['valor'],
                ],
                'interval_hours' => [
                    'id' => $intervalSum['horas']['id'],
                    'value' => $intervalSum['horas']['valor'],
                ],
                'interval_minutes' => [
                    'id' => $intervalSum['minutos']['id'],
                    'value' => $intervalSum['minutos']['valor'],
                ],
                'active' => $group->first()->active,
            ];
        });

        return $arrayGrouped->toArray(); 
    }
}