@props(['product'])

<div class="group relative h-full" x-data="productCard()" @mousemove="handleMouseMove">
    <!-- Product Card Container with Glassmorphism -->
    <div class="relative h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 dark:border-gray-700/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
         :style="cardStyle">
        
        <!-- Image Container with Overlay -->
        <div class="relative h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-900">
            <img src="{{ $product->image ?? 'https://via.placeholder.com/300x200?text=Coffee' }}"
                 alt="{{ $product->name }}"
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            
            <!-- Overlay Gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <!-- Badge -->
            @if($product->discount ?? false)
                <div class="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    -{{ $product->discount }}%
                </div>
            @endif

            @if($product->is_new ?? false)
                <div class="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    New 🆕
                </div>
            @endif
        </div>

        <!-- Content Container -->
        <div class="p-4 space-y-3 relative z-10">
            <!-- Category -->
            <p class="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {{ $product->category->name ?? 'Coffee' }}
            </p>

            <!-- Product Name -->
            <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                {{ $product->name }}
            </h3>

            <!-- Description (Optional) -->
            @if($product->description ?? false)
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {{ $product->description }}
                </p>
            @endif

            <!-- Rating -->
            <div class="flex items-center gap-2">
                <div class="flex gap-1">
                    @for($i = 0; $i < 5; $i++)
                        <svg class="w-4 h-4 {{ $i < ($product->rating ?? 4) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }}" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                    @endfor
                </div>
                <span class="text-xs text-gray-600 dark:text-gray-400">({{ $product->reviews ?? 0 }})</span>
            </div>

            <!-- Price and Action Container -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <!-- Price -->
                <div>
                    <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        ₹{{ number_format($product->price, 2) }}
                    </div>
                    @if($product->original_price ?? false)
                        <p class="text-sm text-gray-500 dark:text-gray-500 line-through">
                            ₹{{ number_format($product->original_price, 2) }}
                        </p>
                    @endif
                </div>

                <!-- Add to Cart Button (Livewire) -->
                <div wire:key="product-{{ $product->id }}-btn">
                    <button 
                        @click="addToCart"
                        class="relative p-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full hover:shadow-lg hover:scale-110 transition-all duration-300 active:scale-95 group/btn"
                        title="Add to cart">
                        <svg class="w-5 h-5 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        
                        <!-- Floating Action Indicator -->
                        <div class="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Floating Action Mini Menu (Optional) -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex flex-col items-center justify-end p-4 gap-3">
            <div class="text-white text-center mb-2">
                <p class="font-semibold">{{ $product->name }}</p>
                <p class="text-sm text-gray-300">₹{{ number_format($product->price, 2) }}</p>
            </div>
            <div class="flex gap-2 w-full">
                <button class="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all backdrop-blur-sm">
                    👀 View
                </button>
                <button class="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    🛒 Cart
                </button>
            </div>
        </div>
    </div>

    <!-- Alpine.js Script -->
    <script>
        function productCard() {
            return {
                cardStyle: {},
                handleMouseMove(e) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;

                    this.cardStyle = {
                        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
                        transition: 'transform 0.3s ease-out'
                    };
                },
                addToCart() {
                    // Livewire event to add to cart
                    @this.addToCart('{{ $product->id }}');
                }
            }
        }
    </script>
</div>
