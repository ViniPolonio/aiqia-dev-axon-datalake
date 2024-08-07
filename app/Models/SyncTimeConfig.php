<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SyncTimeConfig extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $table = 'sync_time_config';

    protected $fillable = [
        'id',
        'type',
        'value',
        'sync_table_config_id',
        'active',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
