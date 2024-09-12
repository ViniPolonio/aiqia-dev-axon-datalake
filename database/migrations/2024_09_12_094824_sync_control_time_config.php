<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sync_control_time_config', function (Blueprint $table) {
            $table->id();
            $table->integer('interval_type');
            $table->integer('interval_value');
            $table->integer('sync_control_config_id');
            $table->integer('data_type')->nullable();
            $table->integer('data_value')->nullable();
            $table->integer('active')->default(1);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
