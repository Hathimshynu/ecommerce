# BrewCraft - Quick Start Reference

## 🚀 Getting Started (5 minutes)

### 1. Start Development Server
```bash
cd d:\Projects\ecommerce
php artisan serve
npm run dev
```

Visit: `http://localhost:8000`

### 2. Key Routes
- **Home**: http://localhost:8000
- **Menu**: http://localhost:8000#menu
- **Offers**: http://localhost:8000#offers
- **Admin Dashboard**: http://localhost:8000/admin (requires auth)
- **Checkout**: http://localhost:8000/checkout

### 3. Test Cart
1. Click cart icon in navbar
2. Click "+" on any product
3. Cart sidebar opens with real-time updates

---

## 🎨 Design Customization

### Colors
Edit in `resources/css/app.css` or use Tailwind utilities:
- Primary: `amber-600` / `from-amber-500 to-orange-600`
- Secondary: `orange-600`
- Accent: `red-600`

### Dark Mode
Toggle in navbar (sun/moon icon). Persists via localStorage.

### Animations
Modify in component files (hero.blade.php, product-card.blade.php):
- `animate-float`: Y-axis floating
- `animate-fade-in`: Opacity + translate fade
- `animate-bounce`: Default bouncing

### Gradients
Example:
```blade
<div class="bg-gradient-to-r from-amber-500 to-orange-600">
```

---

## 📱 Component Tree

```
Layout (layout.blade.php)
├── Navbar
├── Main Content
│   ├── Hero (components/hero.blade.php)
│   ├── Menu Section
│   │   ├── Category Filter (Livewire)
│   │   └── Product Grid (Livewire)
│   │       └── Product Cards (components/product-card.blade.php)
│   ├── Offers Section
│   ├── About Section
│   └── Contact Section
├── Cart Sidebar (Livewire)
└── Footer
```

---

## 🧲 Livewire Actions

### Add to Cart
```blade
<button wire:click="addToCart({{ $product->id }})">
    Add to Cart
</button>
```

### Update Cart Quantity
```php
wire:click="updateQuantity({{ $productId }}, {{ $newQuantity }})"
```

### Remove from Cart
```php
wire:click="removeFromCart({{ $productId }})"
```

---

## 🗄️ Database Entities

### Product Model
```php
{
  id, name, description, price, original_price,
  image, category_id, rating, discount,
  is_featured, is_active, created_at
}
```

### Category Model
```php
{
  id, name, icon, is_active, sort_order
}
```

### Order Model
```php
{
  id, order_number, user_id, first_name, last_name,
  email, phone, address, city, state, zip_code,
  subtotal, tax, discount, total,
  payment_method, status, notes, created_at
}
```

---

## 🔧 Common Tasks

### Add a New Product
```php
// In Tinker
Product::create([
    'name' => 'Espresso',
    'price' => 120,
    'category_id' => 1,
    'image' => 'path/to/image.jpg',
    'description' => 'Strong and smooth',
    'is_active' => true
]);
```

### Create Admin User
```php
// In Tinker
User::create([
    'name' => 'Admin',
    'email' => 'admin@brewcraft.com',
    'password' => Hash::make('password'),
    'is_admin' => true
]);
```

### Check Session Cart
```php
// In route
dd(session('cart'));
```

### Clear Cart
```php
session()->forget('cart');
```

---

## 🎯 Feature Checklist

### Currently Working
- ✅ Product display with filtering
- ✅ Shopping cart (add/remove/update)
- ✅ Checkout form
- ✅ Order placement
- ✅ Dark/Light mode
- ✅ Responsive design
- ✅ 3D effects & animations

### Not Yet Implemented
- ❌ User authentication
- ❌ Payment processing
- ❌ Email notifications
- ❌ Admin product management
- ❌ Order tracking
- ❌ Product reviews
- ❌ Mobile API

---

## 🐛 Debug Tips

### View Component Data
```blade
@dump($products)
@dd($cartItems)
```

### Check Livewire Properties
Add to component:
```php
#[Computed]
public function debug() {
    dd([
        'cartItems' => $this->cartItems,
        'total' => $this->cartTotal
    ]);
}
```

### Laravel Debugbar
```bash
composer require barryvdh/laravel-debugbar --dev
```

### Inspect Network Requests
Open Browser DevTools → Network tab → Check Livewire requests

---

## 📝 Customization Examples

### Change Hero CTA
Edit: `resources/views/components/hero.blade.php`
```blade
<a href="#custom-section" class="...">
    Custom Button
</a>
```

### Add New Category Filter
Edit: `app/Livewire/Menu/CategoryFilter.php`
```php
public function mount() {
    $this->categories = Category::where('is_active', true)
        ->orderBy('sort_order')
        ->get();
}
```

### Customize Product Card Design
Edit: `resources/views/components/product-card.blade.php`
```blade
<!-- Modify card layout/colors/fonts here -->
```

### Change Color Scheme
Global: Edit Tailwind config
Component-specific: Use different color utilities

---

## 🚀 Deployment Quick Checks

Before deploying:

```bash
# Test builds
npm run build
php artisan config:cache
php artisan route:cache

# Check for errors
php artisan tinker  # Make sure models load
composer install --optimize-autoloader

# Run migrations (test environment)
php artisan migrate:fresh --seed
```

---

## 📊 Performance Tips

1. **Cache Product List**
   ```php
   $products = Cache::remember('products', 60*60, fn() => 
       Product::where('is_active', true)->get()
   );
   ```

2. **Lazy Load Images**
   ```blade
   <img loading="lazy" src="{{ $product->image }}">
   ```

3. **Use Pagination**
   ```blade
   {{ $products->links() }}
   ```

4. **Minify CSS/JS**
   ```bash
   npm run build  # production
   ```

---

## 🔐 Security Reminders

- Always validate user input
- Use CSRF tokens (Livewire handles automatically)
- Hash passwords with `Hash::make()`
- Use environment variables for secrets
- Sanitize output with `{{ }}` (not `{!! !!}`)
- Use middleware for authentication

---

## 📚 File Quick Reference

| File | Purpose |
|------|---------|
| `layout.blade.php` | Main layout with nav/footer |
| `home.blade.php` | Hero + all sections |
| `product-card.blade.php` | Single product card component |
| `CartSidebar.php` | Livewire cart logic |
| `CategoryFilter.php` | Livewire filter logic |
| `CheckoutForm.php` | Livewire checkout logic |
| `app.css` | Custom CSS/animations |
| `app.js` | JavaScript initialization |

---

## 🎓 Learning Resources

- [Laravel Docs](https://laravel.com/docs)
- [Livewire Docs](https://laravel-livewire.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Alpine.js](https://alpinejs.dev)
- [Blade Templates](https://laravel.com/docs/blade)

---

## 💬 Need Help?

1. Check `IMPLEMENTATION_GUIDE.md` for detailed setup
2. Check `DEVELOPMENT_CHECKLIST.md` for features
3. Review component source files with comments
4. Use Laravel Tinker for database testing
5. Check browser console for JavaScript errors
6. Use PHPStan/Pint for code analysis

```bash
./vendor/bin/pint         # Format code
./vendor/bin/phpstan      # Analyze code
php artisan test          # Run tests
```

---

## 🎉 You're All Set!

Your modern coffee shop eCommerce platform is ready to use. Enjoy building! ☕

**Version**: 1.0.0
**Last Updated**: April 5, 2024

---
