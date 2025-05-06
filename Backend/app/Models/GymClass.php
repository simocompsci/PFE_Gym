<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GymClass extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'gymclasses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'coach_id',
        'gym_id',
        'max_capacity',
        'duration_minutes',
        'color_code',
        'is_active',
    ];
    protected $guarded = [];

    public function gym() {
        return $this->belongsTo(Gym::class);
    }

    public function coach() {
        return $this->belongsTo(Coach::class);
    }

    public function sessions() {
        return $this->hasMany(ClassSession::class, 'class_id');
    }
}
