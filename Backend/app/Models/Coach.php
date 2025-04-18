<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class Coach extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $guarded = [];

    public function gym() {
        return $this->belongsTo(Gym::class);
    }

    public function classes() {
        return $this->hasMany(GymClass::class);
    }

    public function memberNotes() {
        return $this->hasMany(MemberNote::class);
    }

    public function workoutPlans() {
        return $this->hasMany(CustomWorkoutPlan::class);
    }
}
