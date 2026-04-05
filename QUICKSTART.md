# Quick Start Guide

## 1. Initial Setup (First Time)

```bash
# Navigate to project directory
cd d:\Projects\ecommerce

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Install dependencies
composer install
```

## 2. Configure Database

Edit `.env` file with your MongoDB connection details:
```
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=ecommerce
DB_USERNAME=
DB_PASSWORD=
```

## 3. Start Development Server

```bash
php artisan serve
```

Visit: http://localhost:8000

## 4. Sample Data

To create sample products, create a seeder or import directly to MongoDB:

```bash
# Via artisan (when seeder is created)
php artisan db:seed

# Via MongoDB client
use ecommerce;
db.products.insertMany([
  {
    name: "Sample Product 1",
    description: "A great product",
    price: 29.99,
    stock: 100,
    category: "Electronics",
    is_active: true
  }
]);
```

## 5. Available Routes

- **Home Page**: http://localhost:8000
- **Product Listing**: http://localhost:8000 (on home page)
- **Shopping Cart**: http://localhost:8000/checkout
- **Thank You Page**: http://localhost:8000/order/{id}/thank-you

## 6. Common Commands

```bash
# Clear cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# View routes
php artisan route:list

# Database connection test
php artisan tinker
# Inside tinker:
>>> DB::connection('mongodb')->getDatabaseName()
```

## Troubleshooting

**Issue**: "SQLSTATE[HY000]: General error: 1030 Got error 28..."
- Check database connection in `.env`
- Ensure MongoDB is running

**Issue**: Livewire components not updating
- Clear cache: `php artisan cache:clear`
- Refresh browser

**Issue**: View not found
- Ensure views exist in `resources/views/`
- Check view paths in controllers/routes
