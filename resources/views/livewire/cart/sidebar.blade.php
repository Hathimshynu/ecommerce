<div class="relative">
    <!-- Cart Toggle Button -->
    <button 
        @click="$dispatch('toggleCart')"
        class="relative p-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:scale-110 transition-all duration-300 group">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        
        <!-- Cart Count Badge -->
        @if($itemCount > 0)
            <span class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-scale">
                {{ $itemCount }}
            </span>
        @endif
        
        <div class="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
    </button>

    <!-- Cart Sidebar Drawer -->
    <div 
        x-show="$store.cart.showCart"
        @click.away="$store.cart.showCart = false"
        class="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-all duration-300"
        :class="{ 'translate-x-0': $store.cart.showCart, 'translate-x-full': !$store.cart.showCart }">
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white flex items-center justify-between">
            <h2 class="text-2xl font-bold">Your Cart</h2>
            <button @click="$store.cart.showCart = false" class="text-2xl hover:scale-110 transition-transform">
                ✕
            </button>
        </div>

        <!-- Cart Items -->
        <div class="overflow-y-auto h-[calc(100vh-400px)] p-6 space-y-4">
            @if(empty($cartItems))
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">🛒</div>
                    <p class="text-gray-600 dark:text-gray-400 text-lg">Your cart is empty</p>
                    <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">Add some delicious items to get started!</p>
                </div>
            @else
                @foreach($cartItems as $productId => $item)
                    <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
                        <div class="flex gap-4">
                            <!-- Product Image -->
                            <img 
                                src="{{ $item['image'] ?? 'https://via.placeholder.com/80' }}"
                                alt="{{ $item['name'] }}"
                                class="w-20 h-20 object-cover rounded-lg">
                            
                            <!-- Product Details -->
                            <div class="flex-1">
                                <h3 class="font-semibold text-gray-900 dark:text-white">{{ $item['name'] }}</h3>
                                <p class="text-amber-600 dark:text-amber-400 font-bold">₹{{ number_format($item['price'], 2) }}</p>
                                
                                <!-- Quantity Controls -->
                                <div class="flex items-center gap-2 mt-2">
                                    <button 
                                        wire:click="updateQuantity({{ $productId }}, {{ $item['quantity'] - 1 }})"
                                        class="px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                                        −
                                    </button>
                                    <span class="px-3 py-1 bg-white dark:bg-gray-700 rounded min-w-12 text-center">
                                        {{ $item['quantity'] }}
                                    </span>
                                    <button 
                                        wire:click="updateQuantity({{ $productId }}, {{ $item['quantity'] + 1 }})"
                                        class="px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                                        +
                                    </button>
                                </div>
                            </div>

                            <!-- Subtotal & Remove -->
                            <div class="text-right">
                                <p class="font-bold text-gray-900 dark:text-white">
                                    ₹{{ number_format($item['price'] * $item['quantity'], 2) }}
                                </p>
                                <button 
                                    wire:click="removeFromCart({{ $productId }})"
                                    class="text-red-500 hover:text-red-700 text-sm font-semibold mt-2 transition-colors">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                @endforeach
            @endif
        </div>

        <!-- Footer with Total and Checkout -->
        <div class="absolute bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 p-6 border-t border-gray-300 dark:border-gray-700 space-y-4">
            @if(!empty($cartItems))
                <!-- Promo Code Input -->
                <div class="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Apply promo code"
                        class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <button class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold">
                        Apply
                    </button>
                </div>

                <!-- Totals -->
                <div class="space-y-2 text-gray-700 dark:text-gray-300">
                    <div class="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{{ number_format($cartTotal, 2) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span class="text-green-600 dark:text-green-400">Free</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Tax (5%):</span>
                        <span>₹{{ number_format($cartTotal * 0.05, 2) }}</span>
                    </div>
                </div>

                <!-- Total -->
                <div class="border-t border-gray-300 dark:border-gray-700 pt-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-lg font-bold text-gray-900 dark:text-white">Total:</span>
                        <span class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            ₹{{ number_format($cartTotal * 1.05, 2) }}
                        </span>
                    </div>

                    <!-- Action Buttons -->
                    <div class="space-y-3">
                        <button 
                            wire:click="checkout"
                            class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
                            Proceed to Checkout
                        </button>
                        <button 
                            @click="$store.cart.showCart = false"
                            class="w-full py-3 border-2 border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Continue Shopping
                        </button>
                        <button 
                            wire:click="clearCart"
                            class="w-full py-2 text-red-500 hover:text-red-700 font-semibold text-sm">
                            Clear Cart
                        </button>
                    </div>
                </div>
            @else
                <button 
                    @click="$store.cart.showCart = false"
                    class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300">
                    Continue Shopping
                </button>
            @endif
        </div>
    </div>

    <!-- Overlay -->
    <div 
        x-show="$store.cart.showCart"
        @click="$store.cart.showCart = false"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300"
        :class="{ 'opacity-100': $store.cart.showCart, 'opacity-0 pointer-events-none': !$store.cart.showCart }">
    </div>
</div>
