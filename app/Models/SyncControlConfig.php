<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SyncControlConfig extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $table = 'sync_control_config';

    protected $fillable = [
        'id',
        'process_name',
        'active',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
