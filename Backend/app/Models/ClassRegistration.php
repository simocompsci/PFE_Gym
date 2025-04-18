<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassRegistration extends Model
{
    protected $guarded = [];

    public function session() {
        return $this->belongsTo(ClassSession::class);
    }

    public function client() {
        return $this->belongsTo(Client::class);
    }
}
