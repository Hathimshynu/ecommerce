x# Ecommerce Application - Laravel + Livewire + MongoDB

A modern ecommerce application built with Laravel, Livewire, and MongoDB. This project provides a complete shopping experience with product browsing, cart management, and checkout functionality.

## Features

- **Product Catalog**: Browse and search products with filtering and sorting
- **Dynamic Shopping Cart**: Real-time cart management with Livewire
- **User Authentication**: Secure user registration and login
- **Order Management**: Complete checkout and order tracking
- **MongoDB Integration**: NoSQL database for flexible product schemas
- **Livewire Integration**: Interactive frontend without writing JavaScript

## Technology Stack

- **Framework**: Laravel 11
- **Frontend**: Livewire 3
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Language**: PHP 8.1+

## Project Structure

```
ecommerce/
├── app/
│   ├── Http/
│   │   └── Controllers/          # Application controllers
│   ├── Livewire/
│   │   ├── Products/             # Product listing components
│   │   └── Cart/                 # Shopping cart components
│   └── Models/                   # MongoDB models
├── config/
│   ├── app.php                   # Application configuration
│   ├── database.php              # Database configuration
│   └── query.php                 # Query settings
├── resources/
│   └── views/
│       ├── layout.blade.php      # Main layout template
│       ├── home.blade.php        # Homepage
│       ├── checkout.blade.php    # Checkout page
│       └── livewire/             # Livewire component templates
├── routes/
│   └── web.php                   # Web routes
├── composer.json                 # PHP dependencies
└── .env.example                  # Environment variables template
```

## Installation

### Prerequisites

- PHP 8.1 or higher
- Composer
- MongoDB 4.0 or higher
- Node.js & npm (optional, for asset compilation)

### Setup Steps

1. **Clone or navigate to the project directory**:
   ```bash
   cd d:\Projects\ecommerce
   ```

2. **Copy environment configuration**:
   ```bash
   cp .env.example .env
   ```

3. **Generate application key**:
   ```bash
   php artisan key:generate
   ```

4. **Configure MongoDB connection in `.env`**:
   ```
   DB_CONNECTION=mongodb
   DB_HOST=127.0.0.1
   DB_PORT=27017
   DB_DATABASE=ecommerce
   DB_USERNAME=
   DB_PASSWORD=
   ```

5. **Install Composer dependencies**:
   ```bash
   composer install
   ```

6. **Create necessary directories**:
   ```bash
   mkdir -p storage/framework/sessions
   mkdir -p storage/framework/views
   mkdir -p storage/framework/cache
   mkdir -p storage/logs
   ```

7. **Set proper permissions** (Linux/Mac):
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

## Running the Application

### Development Server

Start the Laravel development server:

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

### Using Livewire

Livewire will automatically handle component updates. No additional configuration is required beyond the standard Laravel setup.

## Database

### MongoDB Collections

The application uses the following MongoDB collections:

- **users**: User accounts and profiles
- **products**: Product catalog and inventory
- **orders**: Customer orders
- **carts**: Shopping carts

### Seeding Sample Data

To seed sample products (create a seeder first):

```bash
php artisan migrate
php artisan db:seed
```

## Key Files

### Models
- `app/Models/Product.php` - Product model for MongoDB
- `app/Models/User.php` - User model
- `app/Models/Order.php` - Order model
- `app/Models/Cart.php` - Shopping cart model

### Livewire Components
- `app/Livewire/Products/ProductList.php` - Product listing with search and filters
- `app/Livewire/Products/ProductCard.php` - Individual product card
- `app/Livewire/Cart/ShoppingCart.php` - Shopping cart management

### Controllers
- `app/Http/Controllers/HomeController.php` - Homepage controller
- `app/Http/Controllers/CheckoutController.php` - Checkout handling

### Routes
- `/` - Homepage with product listing
- `/checkout` - Checkout page
- `/order/{id}/thank-you` - Order confirmation page

## Configuration

### Database Configuration

MongoDB connection is configured in `config/database.php`. Update your `.env` file with your MongoDB credentials:

```env
DB_CONNECTION=mongodb
DB_HOST=your_mongodb_host
DB_PORT=27017
DB_DATABASE=ecommerce
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Development

### Adding New Products

Products can be added via:
1. Direct MongoDB insertion
2. Database seeder
3. Admin panel (to be implemented)

### Customizing Livewire Components

To modify component behavior, edit files in `app/Livewire/`. Changes automatically reflect in views without requiring manual compilation.

### Styling

The project uses Tailwind CSS. Modify classes in view files:
- `resources/views/layout.blade.php` - Main layout styling
- `resources/views/livewire/` - Component-specific styling

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running and accessible
- Verify connection credentials in `.env`
- Check MongoDB permissions and authentication

### Livewire Not Responding
- Clear Laravel cache: `php artisan cache:clear`
- Clear config cache: `php artisan config:clear`
- Ensure Livewire scripts are loaded in layout

### Permission Errors
- Set proper owner: `chown -R www-data:www-data .` (Linux)
- Set directory permissions: `chmod -R 775 storage bootstrap/cache`

## Next Steps

1. **Implement authentication** - Add user login/registration
2. **Payment integration** - Add payment gateway support
3. **Admin panel** - Create product management interface
4. **Email notifications** - Send order confirmation emails
5. **Product images** - Implement image upload and storage
6. **Advanced filtering** - Add price ranges, ratings, reviews
7. **Inventory tracking** - Real-time stock updates
8. **User accounts** - Order history and wishlist

## Support

For issues or questions:
1. Check Laravel documentation: https://laravel.com/docs
2. Review Livewire documentation: https://livewire.laravel.com/docs
3. Consult MongoDB Laravel documentation: https://www.mongodb.com/docs/drivers/php-laravel/

## License

This project is open source and available under the MIT License.
