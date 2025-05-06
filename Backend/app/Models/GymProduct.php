<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GymProduct extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'gym_id',
        'name',
        'description',
        'price',
        'cost',
        'stock_quantity',
        'category',
        'image_url',
        'is_active',
    ];

    public function gym()
    {
        return $this->belongsTo(Gym::class);
    }

    public function sales()
    {
        return $this->hasMany(ProductSale::class);
    }
}
