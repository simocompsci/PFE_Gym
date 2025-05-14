<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function gym() {
        return $this->belongsTo(Gym::class);
    }

    public function memberships() {
        return $this->hasMany(ClientMembership::class);
    }

    public function attendances() {
        return $this->hasMany(Attendance::class);
    }

    public function notes() {
        return $this->hasMany(MemberNote::class);
    }

    public function workoutPlans() {
        return $this->hasMany(CustomWorkoutPlan::class);
    }

    public function goals() {
        return $this->hasMany(ClientGoal::class);
    }
}
