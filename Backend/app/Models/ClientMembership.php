<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClientMembership extends Model
{
    protected $guarded = [];

    // Standard relationships
    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function plan() {
        return $this->belongsTo(MembershipPlan::class, 'membership_plan_id');
    }

    // Polymorphic relationship
    public function creator() {
        return $this->morphTo('creator', 'creator_type', 'creator_id');
    }
}
