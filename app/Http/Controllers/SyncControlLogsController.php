<?php

namespace App\Http\Controllers;

use App\Models\SyncControlConfig;
use App\Models\SyncControlLog;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SyncControlLogsController extends Controller
{
    public function index() {
        try {
            $return  = SyncControlLog::where('success', '=', '1')->get();
            if($return) {
                return response()->json(['status' => 1, 'data' => $return],200);
            }
        }
        catch(\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'Error the searching' . $e->getMessage()
            ]);
        }
    }

    public function consultingExecute($ids) 
    {
        $results = []; 
        try {
            foreach ($ids as $id) {
                if (!is_numeric($id)) {
                    throw new \Exception('Invalid ID provided.');
                }
            }

            foreach ($ids as $id) {
                $consulta = SyncControlLog::where('sync_control_config_id', $id)
                    ->select(['sync_control_config_id', 'success', 'runtime_second', 'finished_at'])
                    ->orderBy('finished_at', 'asc')
                    ->limit(20)
                    ->get()
                    ->toArray();  

                $results[$id] = $consulta;
            }

            return response()->json([
                'data' => $results
            ], 200);
        }
        catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id, Request $request) 
    {
        try {
            $syncControlConfigController = new SyncControlConfigController();

            $consultSyncControlConfig = $syncControlConfigController->consultTimer([$id]);

            if (isset($consultSyncControlConfig['status']) && $consultSyncControlConfig['status'] == 0) {
                return response()->json([
                    'status' => 0,
                    'message' => $consultSyncControlConfig['message']
                ], 404);
            }

            $configTime = collect($consultSyncControlConfig)->firstWhere('sync_control_config_id', $id);

            $config = SyncControlConfig::find($id);

            if (!$config) {
                return response()->json([
                    'status' => 0,
                    'message' => 'SyncControlConfig not found.'
                ], 404);
            }

            $intervalDays = $configTime['interval_day'] ?? 0;
            $intervalHours = $configTime['interval_time'] ?? 0;
            $intervalMinutes = $configTime['interval_minute'] ?? 0;

            $intervalInMinutes = ($intervalDays * 1440) + ($intervalHours * 60) + $intervalMinutes;

            $lastLog = SyncControlLog::where('sync_control_config_id', $id)
                ->whereNotNull('finished_at')
                ->whereNot('finished_at', '=', null)
                ->orderBy('finished_at', 'desc')
                ->select(['finished_at'])
                ->first();

            $inactiveMessage = '';

            if ($intervalInMinutes && $lastLog && $lastLog->finished_at) {
                $timeDifference = \Carbon\Carbon::now()->diffInMinutes(\Carbon\Carbon::parse($lastLog->finished_at));

                if ($timeDifference > $intervalInMinutes) {
                    $inactiveMessage = 2;
                }
            }

            $config->interval_status = $inactiveMessage ?: 1; 

            $intervalDescription = '';
            if ($intervalDays > 0) {
                $intervalDescription .= "{$intervalDays} dia(s) ";
            }
            if ($intervalHours > 0) {
                $intervalDescription .= "{$intervalHours} hora(s) ";
            }
            if ($intervalMinutes > 0) {
                $intervalDescription .= "{$intervalMinutes} minuto(s) ";
            }

            $config->interval_days = $intervalDays;
            $config->interval_hours = $intervalHours;
            $config->interval_minutes = $intervalMinutes;

            $cursor = $request->input('cursor'); 
            $perPage = 20; 

            if ($cursor !== null && !is_string($cursor)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Invalid cursor format.'
                ], 400);
            }

            $logs = SyncControlLog::where('sync_control_config_id', operator: $id)
                                ->whereNot('finished_at', '=', null)
                                ->orderBy('finished_at', 'desc')
                                ->cursorPaginate($perPage, ['*'], 'cursor', $cursor);

            if ($logs->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No logs found for this SyncControlConfig.',
                    'data' => [
                        'config' => $config,
                    ]
                ], 404);
            }

            foreach ($logs as $log) {
                $log->runtime_second = Carbon::parse($log->runtime_second)->timestamp;
            }

            return response()->json([
                'status' => 1,
                'logs' => $logs,
                'has_more' => $logs->hasMorePages()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }


    public function returnShowTableConfig($id) {
        try {
            $records = SyncControlLog::where('sync_control_config_id', '=', $id)->get();
            $lastRecord = $records->last(); 
            return $lastRecord;
    
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function save (Request $request) {
        try {
            $cursor = $request->input('cursor');

            $perPage = 10;

            $configs = SyncControlConfig::whereNull('deleted_at')
                ->orderBy('id')
                ->cursorPaginate($perPage, ['*'], 'cursor', $cursor);

            $data = [];

            foreach ($configs as $config) {
                $logs = SyncControlLog::where('sync_control_config_id', $config->id)
                    ->orderBy('finished_at', 'desc')
                    ->take(10)
                    ->get()
                    ->map(function ($log) {
                        return [
                            'success' => $log->success,
                            'runtime_second' => $log->runtime_second,
                            'finished_at' => $log->finished_at,
                            'error' => $log->error ?? null,
                        ];
                    })
                    ->toArray();

                $data[] = [
                    'sync_control_config_id' => $config->id,
                    'config_data' => [
                        'id' => $config->id,
                        'process_name' => $config->process_name,
                        'active' => $config->active,
                        'created_at' => $config->created_at,
                        'updated_at' => $config->updated_at,
                        'deleted_at' => $config->deleted_at,
                    ],
                    'logs' => $logs,
                ];
            }

            return response()->json([
                'data' => $data,
                'next_cursor' => $configs->nextCursor() 
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'message' => 'An error has occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}
