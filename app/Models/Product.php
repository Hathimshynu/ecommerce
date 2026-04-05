<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products';

    protected $fillable = [
        'name',
        'description',
        'long_description',
        'price',
        'original_price',
        'stock',
        'category_id',
        'image_url',
        'images',
        'sku',
        'is_active',
        'is_featured',
        'rating',
        'reviews_count',
        'caffeine_level',
        'temperature',
        'size',
        'ingredients',
        'allergens',
        'calories',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'stock' => 'integer',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'rating' => 'decimal:1',
        'reviews_count' => 'integer',
        'images' => 'array',
        'ingredients' => 'array',
        'allergens' => 'array',
        'calories' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'product_id');
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, null, 'products', 'orders');
    }

    public function getDiscountPercentage()
    {
        if (!$this->original_price || $this->original_price === $this->price) {
            return 0;
        }
        return round((($this->original_price - $this->price) / $this->original_price) * 100);
    }
}

