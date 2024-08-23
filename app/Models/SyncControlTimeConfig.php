<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SyncControlTimeConfig extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $table = 'sync_control_time_config';

    protected $fillable = [
        'id',
        'interval_type',
        'interval_value',
        'sync_control_config_id',
        'data_type',
        'data_value',
        'active',
        'created_at',
        'updated_at',
        'deleted_at',
    ];
}