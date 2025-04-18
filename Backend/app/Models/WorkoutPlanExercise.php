<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutPlanExercise extends Model
{
    protected $guarded = [];

    public function plan() {
        return $this->belongsTo(CustomWorkoutPlan::class, 'workout_plan_id');
    }
}
