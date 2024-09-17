<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncConfig\SyncControlConfigCreateRequest;
use App\Http\Requests\SyncConfig\SyncControlConfigUpdateRequest;
use App\Models\SyncControlConfig;
use App\Models\SyncControlLog;
use App\Models\SyncControlTimeConfig;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Log;

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

            $data = $configs->map(function ($config) use ($consultTimeConfig) {
                if (is_null($config->process_name)) {
                    return null;
                }

                
                $configTime = $consultTimeConfig->where('sync_control_config_id', $config->id)->first();

                $intervalMinutesId = $configTime['intervals']['interval_in_minutes']['values'][0]['id'] ?? null;
                $intervalHoursId = $configTime['intervals']['interval_in_hours']['values'][0]['id'] ?? null;
                $intervalDaysId = $configTime['intervals']['interval_in_days']['values'][0]['id'] ?? null;

                $lastLog = SyncControlLog::where('sync_control_config_id', $config->id)
                    ->whereNotNull('finished_at')
                    ->where('finished_at', '!=', '')
                    ->when($intervalMinutesId, function($query) use ($intervalMinutesId) {
                        return $query->where('sync_control_time_config_id', $intervalMinutesId);
                    })
                    ->when($intervalHoursId, function($query) use ($intervalHoursId) {
                        return $query->orWhere('sync_control_time_config_id', $intervalHoursId);
                    })
                    ->when($intervalDaysId, function($query) use ($intervalDaysId) {
                        return $query->orWhere('sync_control_time_config_id', $intervalDaysId);
                    })
                    ->orderBy('finished_at', 'desc')
                    ->select(['sync_control_config_id', 'success', 'runtime_second', 'finished_at', 'error'])
                    ->first();

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

                $intervals = [
                    'interval_in_minutes' => [],
                    'interval_in_hours' => [],
                    'interval_in_days' => []
                ];

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

                $calculateStatus = function ($intervalValue, $intervalUnit, $lastLogTime) {
                    if ($intervalValue <= 0 || !$lastLogTime) {
                        return 'inactive';
                    }
                    $finishedAt = \Carbon\Carbon::parse($lastLogTime);
                    $now = \Carbon\Carbon::now();
                    $timeDifference = $now->diffInMinutes($finishedAt);
                    $intervalInMinutes = match ($intervalUnit) {
                        'days' => $intervalValue * 1440, // 1 dia = 1440 minutos
                        'hours' => $intervalValue * 60,  // 1 hora = 60 minutos
                        'minutes' => $intervalValue,
                        default => 0,
                    };
                    return $timeDifference <= $intervalInMinutes ? 'active' : 'inactive';
                };

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

            $config = SyncControlConfig::find($id);

            if (!$config) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No record found.'
                ], 404); 
            }

            $consultTimeConfig = $this->consultTimer([$id]);
            
            if (isset($consultTimeConfig['status']) && $consultTimeConfig['status'] == 0) {
                return response()->json([
                    'status' => 0,
                    'message' => $consultTimeConfig['message']
                ], 404); 
            }

            $consultTimeConfig = collect($consultTimeConfig)->first();
            
            $intervalMinutesId = $consultTimeConfig['intervals']['interval_in_minutes']['values'][0]['id'] ?? null;
            $intervalHoursId = $consultTimeConfig['intervals']['interval_in_hours']['values'][0]['id'] ?? null;
            $intervalDaysId = $consultTimeConfig['intervals']['interval_in_days']['values'][0]['id'] ?? null;

            $lastLog = SyncControlLog::where('sync_control_config_id', $id)
                ->whereNotNull('finished_at')
                ->where('finished_at', '!=', '')
                ->when($intervalMinutesId, function($query) use ($intervalMinutesId) {
                    return $query->where('sync_control_time_config_id', $intervalMinutesId);
                })
                ->when($intervalHoursId, function($query) use ($intervalHoursId) {
                    return $query->orWhere('sync_control_time_config_id', $intervalHoursId);
                })
                ->when($intervalDaysId, function($query) use ($intervalDaysId) {
                    return $query->orWhere('sync_control_time_config_id', $intervalDaysId);
                })
                ->orderBy('finished_at', 'desc')
                ->select(['sync_control_config_id', 'success', 'runtime_second', 'finished_at', 'error'])
                ->first();

            $intervals = [
                'interval_in_minutes' => $consultTimeConfig['intervals']['interval_in_minutes']['values'] ?? [],
                'interval_in_hours' => $consultTimeConfig['intervals']['interval_in_hours']['values'] ?? [],
                'interval_in_days' => $consultTimeConfig['intervals']['interval_in_days']['values'] ?? []
            ];

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

            foreach ($intervals as $key => &$intervalList) {
                foreach ($intervalList as &$interval) {
                    $interval['status'] = $calculateStatus($interval['value'], explode('_', $key)[2], $lastLog?->finished_at);
                }
            }

            return response()->json([
                'status' => 1,
                'data' => [
                    'id' => $config->id,
                    'process_name' => $config->process_name,
                    'active' => $config->active,
                    'created_at' => $config->created_at,
                    'updated_at' => $config->updated_at,
                    'deleted_at' => $config->deleted_at,
                    'intervals' => $intervals,
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
                if ($item->interval_type == 3) { 
                    $intervalSum['dias']['valor'] += $item->interval_value;
                    $intervalSum['dias']['id'] = $item->id; 
                } elseif ($item->interval_type == 2) { 
                    $intervalSum['horas']['valor'] += $item->interval_value;
                    $intervalSum['horas']['id'] = $item->id; 
                } elseif ($item->interval_type == 1) { 
                    $intervalSum['minutos']['valor'] += $item->interval_value;
                    $intervalSum['minutos']['id'] = $item->id; 
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

                if ($intervalType == 1) { 
                    $intervals['interval_in_minutes'][] = [
                        'id' => $intervalId,
                        'value' => $intervalValue
                    ];
                } elseif ($intervalType == 2) { 
                    $intervals['interval_in_hours'][] = [
                        'id' => $intervalId,
                        'value' => $intervalValue
                    ];
                } elseif ($intervalType == 3) { 
                    $intervals['interval_in_days'][] = [
                        'id' => $intervalId,
                        'value' => $intervalValue
                    ];
                }
            }

            $lastLogTime = SyncControlLog::where('sync_control_config_id', $group->first()->sync_control_config_id)
                ->orderBy('finished_at', 'desc')
                ->value('finished_at');

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
                        'days' => $intervalValue * 1440, 
                        'hours' => $intervalValue * 60, 
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