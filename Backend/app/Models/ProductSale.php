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

    // Polymorphic relationship
    public function soldBy() {
        return $this->morphTo('sold_by', 'sold_by_type', 'sold_by_id');
    }
}
