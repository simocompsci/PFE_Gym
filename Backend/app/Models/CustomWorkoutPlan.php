<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomWorkoutPlan extends Model
{
    protected $guarded = [];

    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function coach() {
        return $this->belongsTo(Coach::class);
    }

    public function exercises() {
        return $this->hasMany(WorkoutPlanExercise::class);
    }
}
