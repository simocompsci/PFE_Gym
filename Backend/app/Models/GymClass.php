<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GymClass extends Model
{
    protected $guarded = [];

    public function gym() {
        return $this->belongsTo(Gym::class);
    }

    public function coach() {
        return $this->belongsTo(Coach::class);
    }

    public function sessions() {
        return $this->hasMany(ClassSession::class);
    }
}
