<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $__env->yieldContent('title', 'CoffeeHub - Modern Coffee Shop'); ?></title>
    
    <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::styles(); ?>

    
    <!-- Tailwind CSS -->
    <script defer src="https://cdn.tailwindcss.com"></script>
    
    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">

    <style>
        * {
            font-family: 'Poppins', sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: 'Playfair Display', serif;
        }

        /* Glassmorphism effect */
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .glass-dark {
            background: rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Neumorphism effect */
        .neumorph-light {
            background: #f5f5f5;
            box-shadow: 8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff;
        }

        .neumorph-dark {
            background: #2d3748;
            box-shadow: 8px 8px 16px #1a202c, -8px -8px 16px #3f4a5f;
        }

        /* 3D hover effect */
        .card-3d {
            transform: perspective(1000px);
            transition: transform 0.3s ease;
        }

        .card-3d:hover {
            transform: rotateX(5deg) rotateY(-5deg) translateZ(20px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        /* Smooth gradient backgrounds */
        .gradient-coffee {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        .gradient-warm {
            background: linear-gradient(135deg, #f5a623 0%, #e74c3c 100%);
        }

        /* Floating animation */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }

        .float {
            animation: float 3s ease-in-out infinite;
        }

        /* Parallax effect */
        .parallax {
            background-attachment: fixed;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }

        /* Dark mode toggle */
        .dark-mode-toggle {
            transition: all 0.3s ease;
        }

        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }

        /* Soft shadows */
        .shadow-soft {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        /* Button animations */
        .btn-hover {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .btn-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        /* Blurred navbar effect */
        .navbar-glass {
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .dark .navbar-glass {
            background: rgba(15, 23, 42, 0.8);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Loading spinner */
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Transition utilities */
        .transition-smooth {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    </style>

    <?php echo $__env->yieldPushContent('styles'); ?>
</head>
<body class="bg-white dark:bg-slate-950 text-gray-900 dark:text-white transition-colors duration-300">
    <div x-data="{ 
        darkMode: localStorage.getItem('darkMode') === 'true' || false,
        mobileMenu: false,
        cartOpen: false,
        init() {
            if (this.darkMode) document.documentElement.classList.add('dark');
            this.$watch('darkMode', value => {
                localStorage.setItem('darkMode', value);
                if (value) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });
        }
    }" class="min-h-screen flex flex-col">
        
        <!-- Navigation Bar -->
        <nav class="navbar-glass">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-20">
                    <!-- Logo -->
                    <a href="<?php echo e(route('home')); ?>" class="flex items-center space-x-2 group">
                        <div class="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <span class="text-xl">☕</span>
                        </div>
                        <span class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-500 bg-clip-text text-transparent">CoffeeHub</span>
                    </a>

                    <!-- Desktop Menu -->
                    <div class="hidden md:flex space-x-1">
                        <a href="<?php echo e(route('home')); ?>" class="px-4 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors">Home</a>
                        <a href="<?php echo e(route('home')); ?>#menu" class="px-4 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors">Menu</a>
                        <a href="<?php echo e(route('home')); ?>#offers" class="px-4 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors">Offers</a>
                        <a href="<?php echo e(route('home')); ?>#about" class="px-4 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors">About</a>
                        <a href="<?php echo e(route('home')); ?>#contact" class="px-4 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors">Contact</a>
                    </div>

                    <!-- Right side icons -->
                    <div class="flex items-center space-x-4">
                        <!-- Search -->
                        <div class="hidden sm:block">
                            <input type="text" placeholder="Search..." 
                                   class="px-4 py-2 rounded-full bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 focus:outline-none focus:border-amber-500 transition-colors text-sm">
                        </div>

                        <!-- Dark Mode Toggle -->
                        <button @click="darkMode = !darkMode" 
                                class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                            <i x-show="!darkMode" class="fas fa-moon"></i>
                            <i x-show="darkMode" class="fas fa-sun"></i>
                        </button>

                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->guard()->check()): ?>
                            <!-- User Menu Dropdown -->
                            <div class="relative" x-data="{ userMenuOpen: false }">
                                <button @click="userMenuOpen = !userMenuOpen"
                                        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                                    <i class="fas fa-user-circle text-xl"></i>
                                </button>
                                <div x-show="userMenuOpen" 
                                     @click.away="userMenuOpen = false"
                                     class="absolute right-0 mt-2 w-48 glass rounded-lg shadow-soft z-40">
                                    <p class="px-4 py-2 text-sm font-semibold"><?php echo e(auth()->user()->name); ?></p>
                                    <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">My Orders</a>
                                    <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Settings</a>
                                    <form method="POST" action="<?php echo e(route('logout')); ?>" class="m-0">
                                        <?php echo csrf_field(); ?>
                                        <button type="submit" class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">Logout</button>
                                    </form>
                                </div>
                            </div>
                        <?php else: ?>
                            <a href="<?php echo e(route('login')); ?>" class="px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700">Login</a>
                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                        <!-- Cart Icon -->
                        <button @click="cartOpen = !cartOpen"
                                class="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                            <i class="fas fa-shopping-bag text-xl"></i>
                            <span class="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>

                        <!-- Mobile menu button -->
                        <button @click="mobileMenu = !mobileMenu" class="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div x-show="mobileMenu" class="md:hidden pb-4 space-y-2">
                    <a href="<?php echo e(route('home')); ?>" class="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">Home</a>
                    <a href="<?php echo e(route('home')); ?>#menu" class="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">Menu</a>
                    <a href="<?php echo e(route('home')); ?>#offers" class="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">Offers</a>
                    <a href="<?php echo e(route('home')); ?>#about" class="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">About</a>
                    <a href="<?php echo e(route('home')); ?>#contact" class="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">Contact</a>
                </div>
            </div>
        </nav>

        <!-- Cart Sidebar -->
        <div x-show="cartOpen" 
             @click.away="cartOpen = false"
             class="fixed inset-0 z-40 overflow-hidden">
            <div class="absolute inset-0 bg-black bg-opacity-50" x-show="cartOpen" x-transition></div>
            <div class="absolute right-0 top-20 h-full w-96 bg-white dark:bg-slate-900 shadow-2xl rounded-l-2xl">
                <!-- Cart will be handled by Livewire component -->
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-1">
            <?php echo $__env->yieldContent('content'); ?>
        </main>

        <!-- Footer -->
        <footer class="bg-slate-900 text-white mt-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <!-- About -->
                    <div>
                        <h3 class="text-xl font-bold mb-4">CoffeeHub</h3>
                        <p class="text-gray-400 text-sm">Your favorite destination for premium coffee and cool drinks.</p>
                    </div>

                    <!-- Quick Links -->
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#menu" class="hover:text-white transition-colors">Menu</a></li>
                            <li><a href="#offers" class="hover:text-white transition-colors">Special Offers</a></li>
                            <li><a href="#about" class="hover:text-white transition-colors">About Us</a></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Contact</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li>Email: info@coffeehub.com</li>
                            <li>Phone: +1 (555) 123-4567</li>
                            <li>Hours: 7AM - 9PM</li>
                        </ul>
                    </div>

                    <!-- Social -->
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Follow Us</h4>
                        <div class="flex space-x-4">
                            <a href="#" class="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" class="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-amber-600 transition-colors">
                                <i class="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="border-t border-slate-800 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; 2024 CoffeeHub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>

    <?php echo \Livewire\Mechanisms\FrontendAssets\FrontendAssets::scripts(); ?>

    <?php echo $__env->yieldPushContent('scripts'); ?>
</body>
</html>
<?php /**PATH D:\Projects\ecommerce\resources\views/layout.blade.php ENDPATH**/ ?>