<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Order extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'orders';

    protected $fillable = [
        'user_id',
        'order_number',
        'subtotal_price',
        'tax_price',
        'delivery_fee',
        'total_price',
        'status',
        'payment_method',
        'payment_status',
        'delivery_type',
        'delivery_address',
        'delivery_time',
        'special_instructions',
        'notes',
        'delivered_at',
    ];

    protected $casts = [
        'subtotal_price' => 'decimal:2',
        'tax_price' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'total_price' => 'decimal:2',
        'delivered_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, null, 'orders', 'products');
    }

    public function getStatusBadgeColor()
    {
        return match($this->status) {
            'pending' => 'yellow',
            'confirmed' => 'blue',
            'preparing' => 'purple',
            'ready' => 'green',
            'delivered' => 'green',
            'cancelled' => 'red',
            default => 'gray',
        };
    }
}

