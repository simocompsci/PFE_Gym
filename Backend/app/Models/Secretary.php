<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class Secretary extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $guarded = [];

    public function gym() {
        return $this->belongsTo(Gym::class);
    }
}
