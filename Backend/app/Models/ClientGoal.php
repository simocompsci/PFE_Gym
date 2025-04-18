<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientGoal extends Model
{
    protected $guarded = [];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }
}
