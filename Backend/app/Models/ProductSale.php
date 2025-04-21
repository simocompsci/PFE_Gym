<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSale extends Model
{
    protected $guarded = [];

    // Standard relationships
    public function product() {
        return $this->belongsTo(GymProduct::class);
    }

    public function client() {
        return $this->belongsTo(Client::class);
    }


}
