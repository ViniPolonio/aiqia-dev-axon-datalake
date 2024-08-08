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
                ->select('sync_control.sync_table_config_id', 'sync_control.success', 'sync_control.finished_at')
                ->get();

            return response()->json([
                'status' => 1, 
                'data' => $successRecords
            ], 200);
        } 
        catch (\Exception $e) {
            return response()->json([
                'status' => 0, 
                'message' => 'Error while searching: ' . $e->getMessage()
            ], 500);
        }
    }
}
