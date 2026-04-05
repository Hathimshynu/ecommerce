<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed Categories
        $coffeeCategory = Category::create([
            'name' => 'Coffee',
            'slug' => 'coffee',
            'description' => 'Premium coffee beverages',
            'icon' => '☕',
            'image_url' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=400',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $coolDrinksCategory = Category::create([
            'name' => 'Cool Drinks',
            'slug' => 'cool-drinks',
            'description' => 'Refreshing cold beverages',
            'icon' => '🧊',
            'image_url' => 'https://images.unsplash.com/photo-1437226360030-4b00ef6500ff?w=400',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        $snacksCategory = Category::create([
            'name' => 'Snacks',
            'slug' => 'snacks',
            'description' => 'Delicious food pairings',
            'icon' => '🥐',
            'image_url' => 'https://images.unsplash.com/photo-1585328707802-8b9b5f98f2e0?w=400',
            'sort_order' => 3,
            'is_active' => true,
        ]);

        // Seed Coffee Products
        Product::create([
            'name' => 'Espresso',
            'description' => 'Bold and rich single shot',
            'long_description' => 'Our signature espresso made from premium Ethiopian beans',
            'price' => 2.50,
            'original_price' => 3.00,
            'stock' => 100,
            'category_id' => $coffeeCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=400',
            'sku' => 'ESP-001',
            'is_active' => true,
            'is_featured' => true,
            'rating' => 4.8,
            'reviews_count' => 245,
            'caffeine_level' => 'high',
            'temperature' => 'hot',
            'size' => 'single',
            'ingredients' => ['espresso'],
            'allergens' => [],
            'calories' => 5,
        ]);

        Product::create([
            'name' => 'Cappuccino',
            'description' => 'Smooth blend of espresso and steamed milk',
            'long_description' => 'Perfect balance of espresso, steamed milk, and velvety foam',
            'price' => 4.50,
            'original_price' => 5.00,
            'stock' => 100,
            'category_id' => $coffeeCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
            'sku' => 'CAP-001',
            'is_active' => true,
            'is_featured' => true,
            'rating' => 4.9,
            'reviews_count' => 512,
            'caffeine_level' => 'medium',
            'temperature' => 'hot',
            'size' => 'medium',
            'ingredients' => ['espresso', 'steamed milk', 'milk foam'],
            'allergens' => ['milk'],
            'calories' => 120,
        ]);

        Product::create([
            'name' => 'Latte',
            'description' => 'Creamy and comforting',
            'long_description' => 'Smooth espresso with steamed milk and a touch of foam',
            'price' => 5.00,
            'original_price' => 5.50,
            'stock' => 100,
            'category_id' => $coffeeCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400',
            'sku' => 'LAT-001',
            'is_active' => true,
            'is_featured' => true,
            'rating' => 4.7,
            'reviews_count' => 389,
            'caffeine_level' => 'medium',
            'temperature' => 'hot',
            'size' => 'large',
            'ingredients' => ['espresso', 'steamed milk'],
            'allergens' => ['milk'],
            'calories' => 190,
        ]);

        Product::create([
            'name' => 'Americano',
            'description' => 'Strong black coffee',
            'long_description' => 'Espresso shots with hot water - the classic black coffee',
            'price' => 3.50,
            'original_price' => 4.00,
            'stock' => 100,
            'category_id' => $coffeeCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1521017973486-fba4d2b11b53?w=400',
            'sku' => 'AME-001',
            'is_active' => true,
            'is_featured' => false,
            'rating' => 4.6,
            'reviews_count' => 178,
            'caffeine_level' => 'high',
            'temperature' => 'hot',
            'size' => 'medium',
            'ingredients' => ['espresso', 'hot water'],
            'allergens' => [],
            'calories' => 15,
        ]);

        // Seed Cool Drinks Products
        Product::create([
            'name' => 'Iced Latte',
            'description' => 'Refreshing cold version of our favorite latte',
            'long_description' => 'Smooth espresso with cold milk and ice - perfect for warm days',
            'price' => 5.50,
            'original_price' => 6.00,
            'stock' => 80,
            'category_id' => $coolDrinksCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1517701550927-30cf4ba20d4d?w=400',
            'sku' => 'ICL-001',
            'is_active' => true,
            'is_featured' => true,
            'rating' => 4.8,
            'reviews_count' => 267,
            'caffeine_level' => 'medium',
            'temperature' => 'cold',
            'size' => 'large',
            'ingredients' => ['espresso', 'cold milk', 'ice'],
            'allergens' => ['milk'],
            'calories' => 160,
        ]);

        Product::create([
            'name' => 'Iced Americano',
            'description' => 'Bold and refreshing',
            'long_description' => 'Strong espresso over ice - simple, classic, and invigorating',
            'price' => 4.00,
            'original_price' => 4.50,
            'stock' => 90,
            'category_id' => $coolDrinksCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&auto=format&fit=crop&q=80',
            'sku' => 'ICA-001',
            'is_active' => true,
            'is_featured' => false,
            'rating' => 4.5,
            'reviews_count' => 145,
            'caffeine_level' => 'high',
            'temperature' => 'cold',
            'size' => 'medium',
            'ingredients' => ['espresso', 'ice', 'water'],
            'allergens' => [],
            'calories' => 10,
        ]);

        Product::create([
            'name' => 'Vanilla Cold Brew',
            'description' => 'Smooth cold brew with vanilla syrup',
            'long_description' => 'Our signature cold brew steeped for 24 hours with vanilla notes',
            'price' => 6.00,
            'original_price' => 6.50,
            'stock' => 70,
            'category_id' => $coolDrinksCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1517701550927-30cf4ba20d4d?w=400&auto=format&fit=crop&q=80',
            'sku' => 'VCB-001',
            'is_active' => true,
            'is_featured' => true,
            'rating' => 4.9,
            'reviews_count' => 334,
            'caffeine_level' => 'high',
            'temperature' => 'cold',
            'size' => 'large',
            'ingredients' => ['cold brew', 'vanilla syrup', 'milk'],
            'allergens' => ['milk'],
            'calories' => 220,
        ]);

        Product::create([
            'name' => 'Iced Matcha Latte',
            'description' => 'Creamy matcha green tea',
            'long_description' => 'Premium matcha powder mixed with cold milk for a refreshing boost',
            'price' => 5.75,
            'original_price' => 6.25,
            'stock' => 60,
            'category_id' => $coolDrinksCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&auto=format&fit=crop&q=80',
            'sku' => 'IMM-001',
            'is_active' => true,
            'is_featured' => true,
            'rating' => 4.7,
            'reviews_count' => 198,
            'caffeine_level' => 'medium',
            'temperature' => 'cold',
            'size' => 'medium',
            'ingredients' => ['matcha powder', 'cold milk', 'ice'],
            'allergens' => ['milk'],
            'calories' => 180,
        ]);

        // Seed Snacks Products
        Product::create([
            'name' => 'Chocolate Croissant',
            'description' => 'Buttery croissant with dark chocolate',
            'long_description' => 'Handcrafted fresh daily with premium dark chocolate',
            'price' => 4.50,
            'original_price' => 5.00,
            'stock' => 50,
            'category_id' => $snacksCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1585328107529-9f866e14c4c4?w=400',
            'sku' => 'CHC-001',
            'is_active' => true,
            'is_featured' => true,
            'rating' => 4.8,
            'reviews_count' => 276,
            'caffeine_level' => 'none',
            'temperature' => 'hot',
            'size' => 'single',
            'ingredients' => ['flour', 'butter', 'chocolate', 'eggs'],
            'allergens' => ['gluten', 'milk', 'eggs'],
            'calories' => 320,
        ]);

        Product::create([
            'name' => 'Blueberry Muffin',
            'description' => 'Fresh blueberry muffin',
            'long_description' => 'Made with fresh blueberries and a hint of lemon zest',
            'price' => 3.75,
            'original_price' => 4.25,
            'stock' => 45,
            'category_id' => $snacksCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1585328107529-9f866e14c4c4?w=400&auto=format&fit=crop&q=80',
            'sku' => 'BLM-001',
            'is_active' => true,
            'is_featured' => false,
            'rating' => 4.6,
            'reviews_count' => 134,
            'caffeine_level' => 'none',
            'temperature' => 'warm',
            'size' => 'single',
            'ingredients' => ['flour', 'blueberries', 'eggs', 'sugar'],
            'allergens' => ['gluten', 'eggs'],
            'calories' => 280,
        ]);

        Product::create([
            'name' => 'Almond Biscotti',
            'description' => 'Crunchy almond biscotti',
            'long_description' => 'Perfect for dunking in your favorite coffee or tea',
            'price' => 3.50,
            'original_price' => 4.00,
            'stock' => 60,
            'category_id' => $snacksCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1585328107529-9f866e14c4c4?w=400&auto=format&fit=crop&q=80',
            'sku' => 'ALB-001',
            'is_active' => true,
            'is_featured' => true,
            'rating' => 4.7,
            'reviews_count' => 156,
            'caffeine_level' => 'none',
            'temperature' => 'room',
            'size' => 'single',
            'ingredients' => ['flour', 'almonds', 'eggs', 'sugar'],
            'allergens' => ['gluten', 'nuts', 'eggs'],
            'calories' => 160,
        ]);

        Product::create([
            'name' => 'Cheese Danish',
            'description' => 'Flaky pastry with cheese filling',
            'long_description' => 'Sweet and savory cheese-filled pastry baked fresh daily',
            'price' => 4.75,
            'original_price' => 5.25,
            'stock' => 55,
            'category_id' => $snacksCategory->id,
            'image_url' => 'https://images.unsplash.com/photo-1585328107529-9f866e14c4c4?w=400&auto=format&fit=crop&q=80',
            'sku' => 'CHD-001',
            'is_active' => true,
            'is_featured' => false,
            'rating' => 4.5,
            'reviews_count' => 89,
            'caffeine_level' => 'none',
            'temperature' => 'warm',
            'size' => 'single',
            'ingredients' => ['flour', 'butter', 'cheese', 'eggs'],
            'allergens' => ['gluten', 'milk', 'eggs'],
            'calories' => 350,
        ]);
    }
}
