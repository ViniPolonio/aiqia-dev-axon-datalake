<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SyncTableConfig extends Model
{
    use HasFactory, SoftDeletes;

    protected $connection = 'mysql';

    protected $table = 'sync_table_config';

    protected $fillable = [
        'id',
        'oracle_name',
        'mysql_name',
        'field_check_name',
        'uniq_fields_name',
        'active',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
}
