<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassSession extends Model
{
    protected $guarded = [];

    public function gymClass() {
        return $this->belongsTo(GymClass::class, 'class_id');
    }

    public function coach() {
        return $this->belongsTo(Coach::class);
    }

    public function registrations() {
        return $this->hasMany(ClassRegistration::class, 'session_id');
    }
}
