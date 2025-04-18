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

    // Polymorphic relationship
    public function performedBy() {
        return $this->morphTo('performed_by', 'performed_by_type', 'performed_by_id');
    }
}
