<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientMembership extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Standard relationships
    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function plan() {
        return $this->belongsTo(MembershipPlan::class, 'membership_plan_id');
    }

}
