<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $guarded = [];

    public function gym() {
        return $this->belongsTo(Gym::class);
    }

    public function createdMemberships() {
        return $this->hasMany(ClientMembership::class, 'created_by');
    }
}
