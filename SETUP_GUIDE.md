# CoffeeHub - Modern Coffee Shop Ordering Platform

A premium, modern ecommerce platform for coffee and beverage businesses built with Laravel 10, Livewire 3, Alpine.js, and Tailwind CSS.

## ✨ Features

### UI/UX Design
- **Modern Glassmorphism & Neumorphism Hybrid Design** - Beautiful glass-effect components with soft shadows
- **3D Effects** - Hover lift, parallax scrolling, and 3D card tilt effects
- **Smooth Animations** - Floating elements, transitions, and micro-interactions
- **Dark/Light Mode** - Toggle between theme preferences with localStorage persistence
- **Responsive Design** - Mobile-first approach with perfect on all devices
- **Sticky Header** - Always accessible navigation with blurred glass effect

### Product Features
- **Dynamic Menu Grid** - Category-based product filtering with real-time search
- **Product Cards** - Rich product information with images, pricing, ratings, and quick actions
- **Smart Filtering** - Search and filter by category with live updates (Livewire)
- **Product Customization** - Support for size, temperature, caffeine levels, and custom notes
- **Discounts** - Display discount percentages and sale badges

### Shopping Cart
- **Real-time Cart Updates** - Add/remove items without page reload
- **Dynamic Pricing** - Automatic calculation of subtotal, tax, and delivery fees
- **Cart Panel Sidebar** - Quick access cart with quantity controls
- **Persistent Sessions** - Cart data preserved across sessions

### Checkout
- **Secure Checkout Flow** - Multi-step form with delivery and payment options
- **Delivery Options** - Support for home delivery and pickup
- **Payment Methods** - Credit card, PayPal, and Apple Pay support
- **Order Tracking** - Order status updates (pending, confirmed, preparing, ready, delivered)

### Admin Panel
- **Dashboard** - Overview of orders, revenue, products, and sales metrics
- **Product Management** - Create, edit, and manage products with detailed attributes
- **Category Management** - Organize products by categories with custom icons
- **Order Management** - View and update order statuses
- **Analytics** - Sales trends and best-selling products

## 🛠️ Tech Stack

- **Backend**: Laravel 10 (PHP 8.1+)
- **Frontend**: Livewire 3, Alpine.js, Tailwind CSS
- **Database**: MongoDB (via Laravel MongoDB)
- **Icons**: Font Awesome 6.4
- **Fonts**: Google Fonts (Poppins, Playfair Display)

## 📋 Requirements

- PHP 8.1 or higher
- Composer
- Node.js & npm (optional, for asset compilation)
- MongoDB 5.0+

## 🚀 Installation

### 1. Clone or Extract the Project
```bash
cd /path/to/ecommerce
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database
Edit `.env` and set MongoDB credentials:
```env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=coffeehub
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 5. Create Database Collections
```bash
php artisan migrate
```

### 6. Seed Sample Data
```bash
php artisan db:seed
```

This will create sample categories, products, and drinks with premium imagery.

### 7. Start Development Server
```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## 📱 Default Users

The seeder creates a basic user for testing:
- **Email**: test@example.com (if you add one to the seeder)
- **Password**: password

You can register new accounts via the registration page.

## 🎨 Design Highlights

### Glassmorphism Effect
- Blurred navbar with transparent background
- Glass-effect cards and modals
- Soft white/dark overlays

### 3D Interactions
- Product cards rotate on hover
- Floating animation for hero icons
- Smooth perspective transforms

### Color Scheme
- **Primary**: Amber/Orange (#f59e0b, #ea580c)
- **Accent**: Blue (#3b82f6)
- **Dark Mode**: Slate (#0f172a, #1e293b)
- **Light Mode**: White (#ffffff, #f5f5f5)

### Typography
- **Body**: Poppins (modern, clean)
- **Headlines**: Playfair Display (elegant, premium feel)

## 📁 Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── HomeController.php
│   │   ├── CheckoutController.php
│   │   └── Admin/
│   │       ├── AdminDashboardController.php
│   │       ├── ProductController.php
│   │       ├── CategoryController.php
│   │       └── OrderController.php
│   └── Middleware/
├── Livewire/
│   ├── Menu/
│   │   └── CategoryFilter.php
│   └── Cart/
│       ├── AddToCart.php
│       ├── Badge.php
│       └── Panel.php
├── Models/
│   ├── User.php
│   ├── Product.php
│   ├── Category.php
│   ├── Order.php
│   └── OrderItem.php
resources/
├── views/
│   ├── layout.blade.php
│   ├── home.blade.php
│   ├── checkout.blade.php
│   ├── auth/
│   ├── livewire/
│   │   ├── menu/
│   │   └── cart/
│   └── admin/
routes/
├── web.php
database/
├── migrations/
├── seeders/
│   └── DatabaseSeeder.php
```

## 🔌 API Endpoints (For Mobile Support)

Coming soon! The architecture supports easy REST API implementation.

## 🔐 Security Features

- CSRF protection on all forms
- Secure password hashing with bcrypt
- Session-based authentication
- Protected admin routes
- Input validation on all requests

## 🎯 Usage Guide

### For Customers

1. **Browse Menu**: Scroll through categories or search for products
2. **Add to Cart**: Click "Add to Cart" with desired quantity
3. **Adjust Cart**: Click cart icon to review and modify items
4. **Checkout**: Fill delivery and payment information
5. **Track Order**: View order status in dashboard

### For Admins

1. **Dashboard**: Navigate to `/admin/dashboard` after login
2. **Manage Products**: Edit pricing, stock, images, and details
3. **Manage Categories**: Create/edit product categories
4. **View Orders**: Monitor orders and update delivery status
5. **Analytics**: View sales metrics and trends

## 🎨 Customization

### Color Scheme
Edit `resources/views/layout.blade.php` to change:
- `.gradient-coffee` - Hero section gradient
- `.gradient-warm` - Offers section gradient
- Tailwind classes for primary/accent colors

### Product Attributes
Edit `app/Models/Product.php` to add custom attributes:
```php
'custom_field' => 'cast:type',
```

### Animations
Modify CSS in `layout.blade.php`:
- `@keyframes float` - Floating animation
- `.card-3d:hover` - 3D hover effect
- `animation:` definitions

## 📦 Dependencies Management

### Main Dependencies
- `laravel/framework` - PHP Web Framework
- `livewire/livewire` - Real-time UI components
- `mongodb/laravel-mongodb` - MongoDB integration

### Frontend
- Tailwind CSS (via CDN)
- Alpine.js (via CDN)
- Font Awesome Icons (via CDN)

## 🐛 Troubleshooting

### Collections not created
Ensure MongoDB is running and properly configured in `.env`

### Cart not persisting
Check if sessions configuration is correct in `config/session.php`

### Dark mode not working
Verify that `localStorage` is enabled in browser

### Admin routes not accessible
Ensure you're logged in and add `admin` flag to user model if using database roles

## 📝 Performance Tips

1. **Lazy Load Images**: Use image CDN with responsive sizes
2. **Cache Queries**: Implement Redis caching for product listings
3. **Minify Assets**: Use build tools to minify CSS/JS
4. **Database Indexing**: Index frequently queried fields in MongoDB
5. **CDN**: Serve images from CDN for faster delivery

## 🔄 Deployment

### Environment Variables for Production
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mongodb
CACHE_DRIVER=redis
SESSION_DRIVER=cookie
```

### Deployment Steps
1. Update dependencies: `composer install --no-dev`
2. Build assets: `npm run build` (if using webpack)
3. Generate key: `php artisan key:generate`
4. Run migrations: `php artisan migrate --force`
5. Cache configs: `php artisan config:cache`

## 📞 Support & Contributing

For issues or suggestions, please create an issue in the repository.

## 📄 License

This project is licensed under the MIT License.

---

**Made with ☕ for coffee lovers everywhere**
