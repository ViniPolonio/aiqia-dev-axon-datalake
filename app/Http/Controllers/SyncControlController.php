<?php

namespace App\Http\Controllers;

use App\Models\SyncControl;
use App\Models\SyncTableConfig;
use Illuminate\Http\Request;

class SyncControlController extends Controller
{
    public function consultingExecute() 
    {
        try {
            $subQuery = SyncControl::selectRaw('MAX(finished_at) as latest_finished_at, sync_table_config_id')
                ->groupBy('sync_table_config_id');

            $successRecords = SyncControl::joinSub($subQuery, 'sub', function ($join) {
                    $join->on('sync_control.sync_table_config_id', '=', 'sub.sync_table_config_id')
                        ->on('sync_control.finished_at', '=', 'sub.latest_finished_at');
                })
                ->select('sync_control.sync_table_config_id', 'sync_control.success')
                ->select('sync_control.sync_table_config_id', 'sync_control.finished_at')
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
            $records = SyncControl::where('sync_table_config_id', '=', $id)->get();

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
}
