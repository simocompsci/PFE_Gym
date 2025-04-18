<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberNote extends Model
{
    protected $guarded = [];

    public function coach()
    {
        return $this->belongsTo(Coach::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
