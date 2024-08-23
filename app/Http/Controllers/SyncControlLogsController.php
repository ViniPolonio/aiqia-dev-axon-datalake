<?php

namespace App\Http\Controllers;

use App\Models\SyncControl;
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

    public function consultingExecute() 
    {
        try {
            $subQuery = SyncControlLog::selectRaw('MAX(finished_at) as latest_finished_at, sync_control_config_id')
                ->groupBy('sync_control_config_id');

            $successRecords = SyncControlLog::joinSub($subQuery, 'sub', function ($join) {
                    $join->on('sync_control_log.sync_control_config_id', '=', 'sub.sync_control_config_id')
                        ->on('sync_control_log.finished_at', '=', 'sub.latest_finished_at');
                })
                ->select(
                    'sync_control_log.sync_control_config_id',
                    'sync_control_log.success',
                    'sync_control_log.finished_at',
                    'sync_control_log.process_name',
                    'sync_control_log.process_type',
                    'sync_control_log.runtime_second',
                    'sync_control_log.error',
                    'sync_control_log.process_file',
                    'sync_control_log.started_at',
                    'sync_control_log.is_batch_call',
                    'sync_control_log.start_batch_date',
                    'sync_control_log.end_batch_date',
                    'sync_control_log.sync_control_time_config_id',
                    'sync_control_log.created_at'
                )
                ->get();

            return $successRecords;
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0, 
                'message' => 'Error while searching: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $records = SyncControlLog::where('sync_control_config_id', '=', $id)->get();

            if ($records->isEmpty()) {
                return response()->json([
                    'status' => 0,
                    'message' => 'This control has no records.'
                ], 404);
            }

            return response()->json([
                'status' => 1,
                'data' => $records
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
}
