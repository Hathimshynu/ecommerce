<!-- Hero Section with 3D Glassmorphism Design -->
<div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-amber-900">
    <!-- Animated Background Elements -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
    <div class="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-300 to-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>
    <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

    <!-- Content Container -->
    <div class="relative z-10 container mx-auto px-4 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Left Content -->
            <div class="space-y-8 animate-fade-in">
                <div class="space-y-4">
                    <p class="text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider text-sm">☕ Premium Coffee Experience</p>
                    <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                        Savor Every <span class="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 bg-clip-text text-transparent">Moment</span>
                    </h1>
                    <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        Discover our premium selection of expertly crafted coffees and refreshing cool drinks. Experience the perfect blend of taste and innovation.
                    </p>
                </div>

                <!-- CTA Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <a href="#menu" class="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95">
                        <span class="relative z-10 flex items-center justify-center gap-2">
                            Order Now
                            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </span>
                        <div class="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>

                    <a href="#menu" class="px-8 py-4 border-2 border-gray-800 dark:border-white text-gray-800 dark:text-white font-bold rounded-full hover:bg-gray-800 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-300 hover:scale-105 active:scale-95">
                        Explore Menu
                    </a>
                </div>

                <!-- Quick Stats -->
                <div class="grid grid-cols-3 gap-4 pt-8">
                    <div class="text-center">
                        <p class="text-2xl font-bold text-amber-600 dark:text-amber-400">50+</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Premium Blends</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">4.8★</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Customer Rated</p>
                    </div>
                    <div class="text-center">
                        <p class="text-2xl font-bold text-red-600 dark:text-red-400">24/7</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Fast Delivery</p>
                    </div>
                </div>
            </div>

            <!-- Right Visual (3D Coffee Cup) -->
            <div class="relative h-96 lg:h-[500px] flex items-center justify-center">
                <!-- Coffee Cup Graphic -->
                <div class="relative w-64 h-80 perspective">
                    <div class="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform duration-500" style="backdrop-filter: blur(10px); background-color: rgba(255,255,255,0.1);">
                        <!-- Cup Shine Effect -->
                        <div class="absolute top-8 left-8 w-24 h-32 bg-gradient-to-r from-white to-transparent rounded-full opacity-20 blur-xl"></div>
                        
                        <!-- Coffee Illustration (Placeholder) -->
                        <div class="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                            <div class="text-7xl animate-bounce">☕</div>
                            <div class="text-4xl animate-pulse animation-delay-1000">🍨</div>
                        </div>

                        <!-- Floating Badges -->
                        <div class="absolute -top-6 right-10 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-110 transition-transform">
                            Premium ✨
                        </div>
                        <div class="absolute -bottom-6 left-10 bg-gradient-to-r from-red-400 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg transform hover:scale-110 transition-transform">
                            Fresh Daily 🌿
                        </div>
                    </div>
                </div>

                <!-- Floating Elements -->
                <div class="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-float opacity-75"></div>
                <div class="absolute bottom-32 left-10 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full animate-float animation-delay-2000 opacity-75"></div>
                <div class="absolute bottom-20 right-32 w-20 h-20 bg-gradient-to-br from-orange-300 to-red-400 rounded-full animate-float animation-delay-4000 opacity-50"></div>
            </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>
    </div>

    <!-- CSS for Animations -->
    <style>
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-20px);
            }
        }

        @keyframes fade-in {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-float {
            animation: float 3s ease-in-out infinite;
        }

        .animation-delay-2000 {
            animation-delay: 2s;
        }

        .animation-delay-4000 {
            animation-delay: 4s;
        }

        .animation-delay-1000 {
            animation-delay: 1s;
        }

        .animate-fade-in {
            animation: fade-in 0.8s ease-out forwards;
        }

        .perspective {
            perspective: 1000px;
        }
    </style>
</div>
<?php /**PATH D:\Projects\ecommerce\resources\views/components/hero.blade.php ENDPATH**/ ?>