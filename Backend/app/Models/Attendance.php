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

    
}
