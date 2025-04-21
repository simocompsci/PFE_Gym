<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTracking extends Model
{
    protected $guarded = [];

    // Standard relationships
    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function membership() {
        return $this->belongsTo(ClientMembership::class);
    }

    
}
