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
