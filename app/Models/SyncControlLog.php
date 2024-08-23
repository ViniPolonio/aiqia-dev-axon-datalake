<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SyncControlLog extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $table = 'sync_control_log';

    protected $fillable = [
        'id',
        'process_name',
        'process_type',
        'runtime_second',
        'success',
        'error',
        'process_file',
        'started_at',
        'finished_at',
        'is_batch_call',
        'start_batch_date',
        'end_batch_date',
        'sync_control_config_id',
        'sync_control_time_config_id',
        'created_at',
    ];
}