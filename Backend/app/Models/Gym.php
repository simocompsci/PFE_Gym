<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gym extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function admins()
    {
        return $this->hasMany(Admin::class);
    }

    public function coaches()
    {
        return $this->hasMany(Coach::class);
    }

    public function secretaries()
    {
        return $this->hasMany(Secretary::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function membershipPlans()
    {
        return $this->hasMany(MembershipPlan::class);
    }

    public function classes()
    {
        return $this->hasMany(GymClass::class);
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function products()
    {
        return $this->hasMany(GymProduct::class);
    }
}
