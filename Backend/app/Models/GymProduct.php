<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GymProduct extends Model
{
    protected $guarded = [];

    public function gym()
    {
        return $this->belongsTo(Gym::class);
    }

    public function sales()
    {
        return $this->hasMany(ProductSale::class);
    }
}
