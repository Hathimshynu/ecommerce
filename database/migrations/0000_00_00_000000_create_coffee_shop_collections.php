<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // MongoDB uses collections, not traditional tables
        // This migration is informational for the database schema structure
        // Collections are created automatically on first insert
        
        // Categories Collection Structure
        $categories = [
            [
                '_id' => 'ObjectId()',
                'name' => 'string',
                'slug' => 'string',
                'description' => 'string',
                'icon' => 'string',
                'image_url' => 'string',
                'sort_order' => 'integer',
                'is_active' => 'boolean',
                'created_at' => 'timestamp',
                'updated_at' => 'timestamp',
            ]
        ];

        // Products Collection Structure
        $products = [
            [
                '_id' => 'ObjectId()',
                'name' => 'string',
                'description' => 'string',
                'long_description' => 'string',
                'price' => 'decimal',
                'original_price' => 'decimal',
                'stock' => 'integer',
                'category_id' => 'ObjectId',
                'image_url' => 'string',
                'images' => 'array',
                'sku' => 'string',
                'is_active' => 'boolean',
                'is_featured' => 'boolean',
                'rating' => 'decimal',
                'reviews_count' => 'integer',
                'caffeine_level' => 'string',
                'temperature' => 'string',
                'size' => 'string',
                'ingredients' => 'array',
                'allergens' => 'array',
                'calories' => 'integer',
                'created_at' => 'timestamp',
                'updated_at' => 'timestamp',
            ]
        ];

        // Orders Collection Structure
        $orders = [
            [
                '_id' => 'ObjectId()',
                'user_id' => 'ObjectId',
                'order_number' => 'string',
                'subtotal_price' => 'decimal',
                'tax_price' => 'decimal',
                'delivery_fee' => 'decimal',
                'total_price' => 'decimal',
                'status' => 'string',
                'payment_method' => 'string',
                'payment_status' => 'string',
                'delivery_type' => 'string',
                'delivery_address' => 'string',
                'delivery_time' => 'string',
                'special_instructions' => 'string',
                'notes' => 'string',
                'delivered_at' => 'timestamp',
                'created_at' => 'timestamp',
                'updated_at' => 'timestamp',
            ]
        ];

        // Order Items Collection Structure
        $orderItems = [
            [
                '_id' => 'ObjectId()',
                'order_id' => 'ObjectId',
                'product_id' => 'ObjectId',
                'quantity' => 'integer',
                'unit_price' => 'decimal',
                'total_price' => 'decimal',
                'customizations' => 'array',
                'notes' => 'string',
                'created_at' => 'timestamp',
                'updated_at' => 'timestamp',
            ]
        ];

        // Users Collection Structure
        $users = [
            [
                '_id' => 'ObjectId()',
                'name' => 'string',
                'email' => 'string',
                'password' => 'string',
                'phone' => 'string',
                'address' => 'string',
                'city' => 'string',
                'state' => 'string',
                'zip_code' => 'string',
                'country' => 'string',
                'email_verified_at' => 'timestamp',
                'remember_token' => 'string',
                'created_at' => 'timestamp',
                'updated_at' => 'timestamp',
            ]
        ];
    }

    public function down(): void
    {
        // MongoDB collections are automatically created on insert
        // Manual deletion would be done via MongoDB console if needed
    }
};
