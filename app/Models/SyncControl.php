<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SyncControl extends Model
{
    use HasFactory;


    protected $connection = 'mysql';

    protected $table = 'sync_control';

    protected $fillable = [
        'sync_control_id',
        'table_name',
        'runtime_second',
        'success',
        'error', 
        'started_at',
        'finished_at',
        'is_batch_call',
        'start_batch_date',
        'end_batch_date',
        'sync_table_config_id',
        'sync_time_config_id',
        
    ];

}
