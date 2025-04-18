<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $guarded = [];

    // Standard relationships
    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function session() {
        return $this->belongsTo(ClassSession::class);
    }

    // Polymorphic relationship
    public function recordedBy() {
        return $this->morphTo('recorded_by', 'recorded_by_type', 'recorded_by_id');
    }
}
