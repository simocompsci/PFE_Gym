<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipment extends Model
{
    protected $guarded = [];

    public function gym() {
        return $this->belongsTo(Gym::class);
    }

    public function maintenanceRecords() {
        return $this->hasMany(EquipmentMaintenance::class);
    }
}

