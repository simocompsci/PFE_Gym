<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentMaintenance extends Model
{
    protected $guarded = [];

    // Standard relationship
    public function equipment() {
        return $this->belongsTo(Equipment::class);
    }

    
}
