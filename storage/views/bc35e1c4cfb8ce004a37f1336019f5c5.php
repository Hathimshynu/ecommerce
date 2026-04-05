

<?php $__env->startSection('title', 'BrewCraft - Premium Coffee & Cool Drinks'); ?>

<?php $__env->startSection('content'); ?>
<!-- Hero Section -->
<section id="home">
    <?php echo $__env->make('components.hero', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
</section>

<!-- Menu Section -->
<section id="menu" class="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16 space-y-4">
            <p class="text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Discover</p>
            <h2 class="text-5xl font-bold text-gray-900 dark:text-white">
                Our Premium <span class="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Collection</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Handpicked selections from around the world, crafted to perfection
            </p>
        </div>

        <!-- Category Filter -->
        <?php
$__split = function ($name, $params = []) {
    return [$name, $params];
};
[$__name, $__params] = $__split('menu.category-filter', []);

$__key = null;

$__key ??= \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::generateKey('lw-4120209044-0', $__key);

$__html = app('livewire')->mount($__name, $__params, $__key);

echo $__html;

unset($__html);
unset($__key);
unset($__name);
unset($__params);
unset($__split);
if (isset($__slots)) unset($__slots);
?>

        <!-- Products Grid -->
        <?php
$__split = function ($name, $params = []) {
    return [$name, $params];
};
[$__name, $__params] = $__split('menu.product-grid', []);

$__key = null;

$__key ??= \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::generateKey('lw-4120209044-1', $__key);

$__html = app('livewire')->mount($__name, $__params, $__key);

echo $__html;

unset($__html);
unset($__key);
unset($__name);
unset($__params);
unset($__split);
if (isset($__slots)) unset($__slots);
?>
    </div>
</section>

<!-- Offers Section -->
<section id="offers" class="py-20 px-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
    <div class="container mx-auto">
        <div class="text-center mb-16 space-y-4">
            <p class="text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Limited Time</p>
            <h2 class="text-5xl font-bold text-gray-900 dark:text-white">
                Special <span class="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Offers</span>
            </h2>
        </div>

        <!-- Offer Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <?php
            $offers = [
                [
                    'title' => 'Buy 2 Get 1 Free',
                    'description' => 'On all beverages',
                    'badge' => '30% OFF',
                    'icon' => '🎁',
                    'color' => 'from-red-400 to-pink-500'
                ],
                [
                    'title' => 'Morning Special',
                    'description' => 'Before 10 AM',
                    'badge' => '50% OFF',
                    'icon' => '🌅',
                    'color' => 'from-orange-400 to-yellow-500'
                ],
                [
                    'title' => 'Weekend Combo',
                    'description' => 'Coffee + Snack',
                    'badge' => '₹249',
                    'icon' => '☕',
                    'color' => 'from-amber-400 to-orange-500'
                ],
            ];
            ?>

            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $offers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $offer): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                    <!-- Background gradient -->
                    <div class="absolute inset-0 bg-gradient-to-br <?php echo e($offer['color']); ?> opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                    
                    <!-- Content -->
                    <div class="relative z-10">
                        <!-- Icon -->
                        <div class="text-6xl mb-4"><?php echo e($offer['icon']); ?></div>

                        <!-- Badge -->
                        <div class="inline-block mb-4">
                            <span class="px-3 py-1 bg-gradient-to-r <?php echo e($offer['color']); ?> text-white text-sm font-bold rounded-full">
                                <?php echo e($offer['badge']); ?>

                            </span>
                        </div>

                        <!-- Title -->
                        <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            <?php echo e($offer['title']); ?>

                        </h3>

                        <!-- Description -->
                        <p class="text-gray-600 dark:text-gray-400 mb-6">
                            <?php echo e($offer['description']); ?>

                        </p>

                        <!-- CTA Button -->
                        <a href="#menu" class="inline-block px-6 py-3 bg-gradient-to-r <?php echo e($offer['color']); ?> text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
                            Order Now →
                        </a>
                    </div>
                </div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
        </div>
    </div>
</section>

<!-- About Section -->
<section id="about" class="py-20 px-4 bg-white dark:bg-gray-900">
    <div class="container mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Left Content -->
            <div class="space-y-8">
                <div>
                    <p class="text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">About Us</p>
                    <h2 class="text-5xl font-bold text-gray-900 dark:text-white mt-4">
                        Crafted with <span class="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Passion</span>
                    </h2>
                </div>

                <p class="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                    At BrewCraft, we believe that every cup tells a story. Our expert baristas source the finest coffee beans from sustainable farms across the world, ensuring not just exceptional taste but also ethical practices.
                </p>

                <!-- Features -->
                <div class="space-y-4">
                    <div class="flex items-start gap-4">
                        <div class="text-3xl">✓</div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
                            <p class="text-gray-600 dark:text-gray-400">Only 100% Arabica and specialty beans</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="text-3xl">✓</div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Fresh & Fast</h3>
                            <p class="text-gray-600 dark:text-gray-400">Made to order with lightning-fast delivery</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="text-3xl">✓</div>
                        <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-2">Eco-Friendly</h3>
                            <p class="text-gray-600 dark:text-gray-400">Sustainable packaging & ethical sourcing</p>
                        </div>
                    </div>
                </div>

                <!-- CTA -->
                <a href="#menu" class="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
                    Explore Our Menu →
                </a>
            </div>

            <!-- Right Visual -->
            <div class="relative h-96 flex items-center justify-center">
                <div class="text-center">
                    <div class="text-9xl mb-6 animate-float">☕</div>
                    <div class="space-y-2">
                        <p class="text-2xl font-bold text-gray-900 dark:text-white">Since 2020</p>
                        <p class="text-gray-600 dark:text-gray-400">Serving Excellence</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section id="contact" class="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
    <div class="container mx-auto max-w-4xl">
        <div class="text-center mb-16 space-y-4">
            <p class="text-amber-400 font-semibold uppercase tracking-wider">Get in Touch</p>
            <h2 class="text-5xl font-bold">Contact Us</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <!-- Phone -->
            <a href="tel:+919876543210" class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center group">
                <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">📞</div>
                <p class="text-sm text-gray-400 mb-2">PHONE</p>
                <p class="text-xl font-bold">+91 9876543210</p>
            </a>

            <!-- Email -->
            <a href="mailto:hello@brewcraft.com" class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center group">
                <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">📧</div>
                <p class="text-sm text-gray-400 mb-2">EMAIL</p>
                <p class="text-xl font-bold">hello@brewcraft.com</p>
            </a>

            <!-- Location -->
            <a href="https://maps.google.com" class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 text-center group">
                <div class="text-4xl mb-4 group-hover:scale-110 transition-transform">📍</div>
                <p class="text-sm text-gray-400 mb-2">LOCATION</p>
                <p class="text-xl font-bold">123 Coffee Street, City</p>
            </a>
        </div>

        <!-- Contact Form -->
        <form class="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" placeholder="Your Name" class="px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-amber-400 focus:outline-none text-white placeholder-gray-400">
                <input type="email" placeholder="Your Email" class="px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-amber-400 focus:outline-none text-white placeholder-gray-400">
            </div>
            <textarea placeholder="Your Message" rows="5" class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-amber-400 focus:outline-none text-white placeholder-gray-400"></textarea>
            <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
                Send Message
            </button>
        </form>
    </div>
</section>

<?php $__env->stopSection(); ?>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16">
                <h2 class="text-5xl font-bold mb-4">Our Menu</h2>
                <p class="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                    Explore our carefully curated selection of premium beverages and delicious treats
                </p>
            </div>

            <!-- Category Tabs with Livewire Component -->
            <?php
$__split = function ($name, $params = []) {
    return [$name, $params];
};
[$__name, $__params] = $__split('menu.category-filter', []);

$__key = null;

$__key ??= \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::generateKey('lw-4120209044-2', $__key);

$__html = app('livewire')->mount($__name, $__params, $__key);

echo $__html;

unset($__html);
unset($__key);
unset($__name);
unset($__params);
unset($__split);
if (isset($__slots)) unset($__slots);
?>
        </div>
    </section>

    <!-- Offers Section -->
    <section id="offers" class="py-20 bg-gradient-warm relative overflow-hidden">
        <div class="absolute inset-0 opacity-20">
            <div class="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-5xl font-bold mb-4 text-white">Special Offers</h2>
                <p class="text-white/90 text-lg">Limited time deals on your favorite items</p>
            </div>

            <!-- Offers Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__empty_1 = true; $__currentLoopData = \App\Models\Product::where('is_featured', true)->take(3)->get(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
                    <div class="card-3d glass rounded-2xl shadow-soft p-6 text-white transform hover:scale-105 transition-transform">
                        <div class="relative mb-4 h-48 rounded-xl overflow-hidden">
                            <img src="<?php echo e($product->image_url); ?>" alt="<?php echo e($product->name); ?>" class="w-full h-full object-cover">
                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->getDiscountPercentage() > 0): ?>
                                <div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                                    -<?php echo e($product->getDiscountPercentage()); ?>%
                                </div>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                        </div>
                        <h3 class="text-2xl font-bold mb-2"><?php echo e($product->name); ?></h3>
                        <p class="text-white/80 mb-4"><?php echo e($product->description); ?></p>
                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl font-bold">$<?php echo e(number_format($product->price, 2)); ?></span>
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->original_price): ?>
                                    <span class="text-sm line-through">$<?php echo e(number_format($product->original_price, 2)); ?></span>
                                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            </div>
                            <button class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg btn-hover">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
                    <p class="text-gray-500 col-span-full text-center">No featured offers available</p>
                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <!-- Image -->
                <div class="rounded-2xl overflow-hidden shadow-soft h-96 md:h-full">
                    <img src="https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=600" alt="About CoffeeHub" class="w-full h-full object-cover">
                </div>

                <!-- Content -->
                <div>
                    <h2 class="text-5xl font-bold mb-6">About CoffeeHub</h2>
                    <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
                        We are passionate about delivering the finest coffee and beverage experiences. Our beans are sourced from sustainable farms around the world, ensuring quality and ethical practices.
                    </p>
                    <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                        Every drink is carefully crafted by our expert baristas to perfection. We believe in the art of coffee making and the joy of sharing great moments with great people.
                    </p>

                    <!-- Features -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl">
                                <i class="fas fa-leaf"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">100% Sustainable</h3>
                                <p class="text-gray-600 dark:text-gray-400">Ethically sourced coffee beans</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl">
                                <i class="fas fa-heart"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">Made with Love</h3>
                                <p class="text-gray-600 dark:text-gray-400">Crafted by expert baristas</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl">
                                <i class="fas fa-star"></i>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">Premium Quality</h3>
                                <p class="text-gray-600 dark:text-gray-400">Only the best ingredients</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gray-50 dark:bg-slate-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-5xl font-bold mb-4">Get in Touch</h2>
                <p class="text-gray-600 dark:text-gray-400 text-lg">Have questions? We'd love to hear from you</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <!-- Contact Info -->
                <div class="glass rounded-2xl p-8 text-center">
                    <i class="fas fa-map-marker-alt text-4xl text-amber-500 mb-4 block"></i>
                    <h3 class="text-xl font-bold mb-2">Visit Us</h3>
                    <p class="text-gray-600 dark:text-gray-400">123 Coffee Street<br>Bean City, BC 12345</p>
                </div>

                <div class="glass rounded-2xl p-8 text-center">
                    <i class="fas fa-phone text-4xl text-amber-500 mb-4 block"></i>
                    <h3 class="text-xl font-bold mb-2">Call Us</h3>
                    <p class="text-gray-600 dark:text-gray-400">+1 (555) 123-4567<br>Mon-Fri 9AM-6PM</p>
                </div>

                <div class="glass rounded-2xl p-8 text-center">
                    <i class="fas fa-envelope text-4xl text-amber-500 mb-4 block"></i>
                    <h3 class="text-xl font-bold mb-2">Email Us</h3>
                    <p class="text-gray-600 dark:text-gray-400">info@coffeehub.com<br>support@coffeehub.com</p>
                </div>
            </div>

            <!-- Contact Form -->
            <div class="max-w-2xl mx-auto glass rounded-2xl p-8">
                <form class="space-y-6">
                    <?php echo csrf_field(); ?>
                    <div>
                        <label class="block text-sm font-medium mb-2">Name</label>
                        <input type="text" class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-amber-500" placeholder="Your name">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Email</label>
                        <input type="email" class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-amber-500" placeholder="your@email.com">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">Message</label>
                        <textarea class="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-amber-500 h-32" placeholder="Your message..."></textarea>
                    </div>
                    <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg btn-hover">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </section>
<?php $__env->stopSection(); ?>

<?php $__env->startPush('scripts'); ?>
    <script>
        // 3D Tilt effect for product cards
        document.querySelectorAll('.card-3d').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    </script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('layout', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH D:\Projects\ecommerce\resources\views/home.blade.php ENDPATH**/ ?>