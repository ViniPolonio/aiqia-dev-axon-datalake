<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncConfig\SyncControlConfigCreateRequest;
use App\Http\Requests\SyncConfig\SyncControlConfigUpdateRequest;
use App\Models\SyncControlConfig;
use App\Models\SyncControlLog;
use App\Models\SyncControlTimeConfig;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SyncControlConfigController extends Controller

{
    public function index() 
    {
        try {
            // Obter todas as configurações que não foram excluídas
            $configs = SyncControlConfig::whereNull('deleted_at')->get();
            $ids = $configs->pluck('id');

            // Consultar tempos de configuração
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

            $data = $configs->map(function ($config) use ($consultTimeConfig) {
                if (is_null($config->process_name)) {
                    return null;
                }

                // Obter o último log concluído
                $lastLog = SyncControlLog::where('sync_control_config_id', $config->id)
                    ->whereNotNull('finished_at')
                    ->where('finished_at', '!=', '')
                    ->orderBy('finished_at', 'desc')
                    ->select(['sync_control_config_id', 'success', 'runtime_second', 'finished_at', 'error'])
                    ->first();
                    
                // Obter os últimos 20 logs
                $logs = SyncControlLog::where('sync_control_config_id', $config->id)
                    ->whereNotNull('finished_at')
                    ->whereNot('finished_at', '=', null)
                    ->orderBy('finished_at', 'desc')
                    ->take(20)
                    ->select(['sync_control_config_id', 'success', 'runtime_second', 'finished_at', 'error'])
                    ->get()
                    ->map(function ($log) {
                        return [
                            'success' => $log->success,
                            'runtime_second' => Carbon::parse($log->runtime_second)->timestamp,
                            'finished_at' => $log->finished_at,
                            'error' => $log->error ?? null,
                        ];
                    })
                    ->toArray();
                $configTime = $consultTimeConfig->where('sync_control_config_id', $config->id)->first();

                $intervals = [
                    'interval_in_minutes' => [],
                    'interval_in_hours' => [],
                    'interval_in_days' => []
                ];

                // Popula os intervalos
                if ($configTime) {
                    foreach ($configTime['intervals']['interval_in_minutes']['values'] as $interval) {
                        $intervals['interval_in_minutes'][] = $interval;
                    }
                    foreach ($configTime['intervals']['interval_in_hours']['values'] as $interval) {
                        $intervals['interval_in_hours'][] = $interval;
                    }
                    foreach ($configTime['intervals']['interval_in_days']['values'] as $interval) {
                        $intervals['interval_in_days'][] = $interval;
                    }
                }

                // Função para calcular o status do intervalo
                $calculateStatus = function ($intervalValue, $intervalUnit, $lastLogTime) {
                    if ($intervalValue <= 0 || !$lastLogTime) {
                        return 'inactive';
                    }
                    $finishedAt = \Carbon\Carbon::parse($lastLogTime);
                    $now = \Carbon\Carbon::now();
                    $timeDifference = $now->diffInMinutes($finishedAt);
                    $intervalInMinutes = match ($intervalUnit) {
                        'days' => $intervalValue * 1440, // 1 dia = 1440 minutos
                        'hours' => $intervalValue * 60, // 1 hora = 60 minutos
                        'minutes' => $intervalValue,
                        default => 0,
                    };
                    return $timeDifference <= $intervalInMinutes ? 'active' : 'inactive';
                };

                // Calcula status para cada intervalo e os adiciona ao array
                foreach ($intervals as $key => &$intervalList) {
                    foreach ($intervalList as &$interval) {
                        $interval['status'] = $calculateStatus($interval['value'], explode('_', $key)[2], $lastLog?->finished_at);
                    }
                }

                return [
                    'sync_control_config_id' => $config->id,
                    'config_data' => [
                        'id' => $config->id,
                        'process_name' => $config->process_name,
                        'active' => $config->active,
                        'created_at' => $config->created_at,
                        'updated_at' => $config->updated_at,
                        'deleted_at' => $config->deleted_at,
                        'intervals' => $intervals,
                    ],
                    'logs' => $logs ?: null,
                ];
            })->filter()->values()->toArray();

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

            $intervalMinutesValues = $interval['intervals']['interval_in_minutes']['values'] ?? [];
            $intervalHoursValues = $interval['intervals']['interval_in_hours']['values'] ?? [];
            $intervalDaysValues = $interval['intervals']['interval_in_days']['values'] ?? [];

            $minutesStatus = [];
            foreach ($intervalMinutesValues as $minuteInterval) {
                $syncControlLog = SyncControlLog::where('sync_control_time_config_id', $minuteInterval['id'])
                    ->where('sync_control_config_id', $id)
                    ->first();

                $finishedAt = $syncControlLog ? $syncControlLog->finished_at : null;
                $timeDifference = now()->diffInMinutes($finishedAt);

                $status = ($timeDifference > $minuteInterval) ? 'active' : 'inactive';
                $minutesStatus[] = [
                    'id' => $minuteInterval['id'],
                    'value' => $minuteInterval['value'],
                    'status' => $status
                ];
            }

            // Horas
            $hoursStatus = [];
            foreach ($intervalHoursValues as $hourInterval) {
                $intervalValueInMinutes = $hourInterval['value'] * 60;

                $syncControlLog = SyncControlLog::where('sync_control_time_config_id', $hourInterval['id'])
                    ->where('sync_control_config_id', $id)
                    ->first();

                $finishedAt = $syncControlLog ? $syncControlLog->finished_at : null;
                $timeDifference = now()->diffInMinutes($finishedAt);

                $status = ($timeDifference > $intervalValueInMinutes) ? 'active' : 'inactive';
                $hoursStatus[] = [
                    'id' => $hourInterval['id'],
                    'value' => $hourInterval['value'],
                    'status' => $status
                ];
            }

            $daysStatus = [];
            foreach ($intervalDaysValues as $dayInterval) {
                $intervalValueInMinutes = $dayInterval['value'] * 1440; // 1 dia = 1440 minutos

                $syncControlLog = SyncControlLog::where('sync_control_time_config_id', $dayInterval['id'])
                    ->where('sync_control_config_id', $id)
                    ->first();

                $finishedAt = $syncControlLog ? $syncControlLog->finished_at : null;
                $timeDifference = now()->diffInMinutes($finishedAt);

                // Status correto: ativo se o tempo decorrido for menor que o valor do intervalo
                $status = ($timeDifference < $intervalValueInMinutes) ? 'active' : 'inactive';
                $daysStatus[] = [
                    'id' => $dayInterval['id'],
                    'value' => $dayInterval['value'],
                    'status' => $status
                ];
            }

            // Adicionando os intervalos no retorno
            $return->interval_in_minutes = $minutesStatus;
            $return->interval_in_hours = $hoursStatus;
            $return->interval_in_days = $daysStatus;

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
                    'interval_in_hours' => $return->interval_in_hours,
                    'interval_in_days' => $return->interval_in_days, 
                ],
            ], 200);
        } catch (\Exception $e) {
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

    public function consultTimerShow($ids) 
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

    public function consultTimer($ids) 
    {
        $consultTimeConfig = SyncControlTimeConfig::whereIn('sync_control_config_id', $ids)
            ->where('active', 1)
            ->get();

        // Agrupa por sync_control_config_id
        $arrayGrouped = $consultTimeConfig->groupBy('sync_control_config_id')->map(function ($group) {
            $intervals = [
                'interval_in_minutes' => [],
                'interval_in_hours' => [],
                'interval_in_days' => []
            ];

            foreach ($group as $item) {
                $intervalType = $item->interval_type;
                $intervalValue = $item->interval_value;
                $intervalId = $item->id;

                if ($intervalType == 1) { // Minutos
                    $intervals['interval_in_minutes'][] = [
                        'id' => $intervalId,
                        'value' => $intervalValue
                    ];
                } elseif ($intervalType == 2) { // Horas
                    $intervals['interval_in_hours'][] = [
                        'id' => $intervalId,
                        'value' => $intervalValue
                    ];
                } elseif ($intervalType == 3) { // Dias
                    $intervals['interval_in_days'][] = [
                        'id' => $intervalId,
                        'value' => $intervalValue
                    ];
                }
            }

            // Obter o último tempo de log, se existir
            $lastLogTime = SyncControlLog::where('sync_control_config_id', $group->first()->sync_control_config_id)
                ->orderBy('finished_at', 'desc')
                ->value('finished_at');

            // Calcula o status dos intervalos
            $status = function ($intervals, $intervalUnit, $lastLogTime) {
                if (!$lastLogTime) {
                    return 'inactive';
                }

                $finishedAt = \Carbon\Carbon::parse($lastLogTime);
                $now = \Carbon\Carbon::now();
                $timeDifference = $now->diffInMinutes($finishedAt);

                foreach ($intervals as $interval) {
                    $intervalValue = $interval['value'];
                    $intervalInMinutes = match ($intervalUnit) {
                        'days' => $intervalValue * 1440, // 1 dia = 1440 minutos
                        'hours' => $intervalValue * 60, // 1 hora = 60 minutos
                        'minutes' => $intervalValue,
                        default => 0,
                    };

                    if ($timeDifference <= $intervalInMinutes) {
                        return 'active';
                    }
                }
                return 'inactive';
            };

            return [
                'sync_control_config_id' => $group->first()->sync_control_config_id,
                'intervals' => [
                    'interval_in_minutes' => [
                        'values' => $intervals['interval_in_minutes'],
                        'status' => $status($intervals['interval_in_minutes'], 'minutes', $lastLogTime),
                    ],
                    'interval_in_hours' => [
                        'values' => $intervals['interval_in_hours'],
                        'status' => $status($intervals['interval_in_hours'], 'hours', $lastLogTime),
                    ],
                    'interval_in_days' => [
                        'values' => $intervals['interval_in_days'],
                        'status' => $status($intervals['interval_in_days'], 'days', $lastLogTime),
                    ],
                ],
                'active' => $group->first()->active,
            ];
        });

        return $arrayGrouped->toArray(); 
    }
}