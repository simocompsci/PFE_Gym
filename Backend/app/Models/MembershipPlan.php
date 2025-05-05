<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MembershipPlan extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function gym() {
        return $this->belongsTo(Gym::class);
    }

    public function clientMemberships() {
        return $this->hasMany(ClientMembership::class);
    }
}
