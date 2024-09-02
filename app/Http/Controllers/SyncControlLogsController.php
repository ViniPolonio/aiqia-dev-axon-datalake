<?php

namespace App\Http\Controllers;

use App\Models\SyncControl;
use App\Models\SyncControlConfig;
use App\Models\SyncControlLog;
use App\Models\SyncTableConfig;
use Illuminate\Http\Request;

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
            $cursor = $request->input('cursor'); 
            $perPage = 20; 

            if ($cursor !== null && !is_string($cursor)) {
                return response()->json([
                    'status' => 0,
                    'message' => 'Invalid cursor format.'
                ], 400);
            }

            
            $config = SyncControlConfig::find($id);

            if (!$config) {
                return response()->json([
                    'status' => 0,
                    'message' => 'SyncControlConfig not found.'
                ], 404);
            }

            $logs = SyncControlLog::where('sync_control_config_id', $id)
                ->orderBy('finished_at', 'desc')
                ->cursorPaginate($perPage, ['*'], 'cursor', $cursor);
            foreach ($logs as $log) {
                if (is_null($log->process_name)) {
                    continue;
                }

            if ($logs->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'No logs found for this SyncControlConfig.'
                ], 404);
            }
        }
            return response()->json([
                'status' => 1,
                'data' => [
                    'config' => $config,
                    'logs' => $logs,
                    'has_more' => $logs->hasMorePages()
                ]
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
