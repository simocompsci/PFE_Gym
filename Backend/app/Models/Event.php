<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $guarded = [];

    public function gym()
    {
        return $this->belongsTo(Gym::class);
    }

   
}
