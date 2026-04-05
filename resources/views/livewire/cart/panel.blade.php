<div class="flex flex-col h-full bg-white dark:bg-slate-900">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
        <h2 class="text-2xl font-bold">Shopping Cart</h2>
        <button @click="cartOpen = false" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl">
            <i class="fas fa-times"></i>
        </button>
    </div>

    <!-- Cart Items -->
    <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        @if(count($cart) > 0)
            @foreach($cart as $productId => $item)
                <div class="flex gap-4 bg-gray-50 dark:bg-slate-800 rounded-lg p-4 group">
                    <!-- Product Image -->
                    <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img src="{{ $item['image_url'] }}" alt="{{ $item['name'] }}" class="w-full h-full object-cover">
                    </div>

                    <!-- Product Info -->
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold text-sm line-clamp-2">{{ $item['name'] }}</h3>
                        <p class="text-amber-600 dark:text-amber-400 font-bold mt-1">
                            ${{ number_format($item['price'], 2) }}
                        </p>

                        <!-- Quantity Controls -->
                        <div class="flex items-center gap-2 mt-2">
                            <button 
                                wire:click="updateQuantity('{{ $productId }}', {{ $item['quantity'] - 1 }})"
                                class="w-6 h-6 rounded-md bg-gray-200 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-600 text-xs"
                            >
                                <i class="fas fa-minus text-xs"></i>
                            </button>
                            <span class="px-2 font-semibold text-sm min-w-[20px] text-center">{{ $item['quantity'] }}</span>
                            <button 
                                wire:click="updateQuantity('{{ $productId }}', {{ $item['quantity'] + 1 }})"
                                class="w-6 h-6 rounded-md bg-gray-200 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-slate-600 text-xs"
                            >
                                <i class="fas fa-plus text-xs"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Total Price & Remove Button -->
                    <div class="text-right flex flex-col items-end justify-between">
                        <div class="text-sm font-bold">
                            ${{ number_format($item['price'] * $item['quantity'], 2) }}
                        </div>
                        <button 
                            wire:click="removeItem('{{ $productId }}')"
                            class="text-red-500 hover:text-red-700 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <i class="fas fa-trash text-xs"></i> Remove
                        </button>
                    </div>
                </div>
            @endforeach
        @else
            <!-- Empty Cart -->
            <div class="flex flex-col items-center justify-center h-full text-center py-8">
                <i class="fas fa-shopping-bag text-5xl text-gray-300 dark:text-gray-700 mb-4"></i>
                <p class="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">Add some delicious items to get started!</p>
            </div>
        @endif
    </div>

    <!-- Footer / Checkout -->
    @if(count($cart) > 0)
        <div class="border-t border-gray-200 dark:border-slate-700 px-6 py-6 bg-white dark:bg-slate-900 space-y-4 sticky bottom-0">
            <!-- Summary -->
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span class="font-semibold">${{ number_format($subtotal, 2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                    <span class="font-semibold">${{ number_format($tax, 2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                    <span class="font-semibold">${{ number_format(2.50, 2) }}</span>
                </div>
            </div>

            <!-- Total -->
            <div class="border-t border-gray-200 dark:border-slate-700 pt-4">
                <div class="flex justify-between items-center mb-4">
                    <span class="font-bold text-lg">Total</span>
                    <span class="text-2xl font-bold text-amber-600 dark:text-amber-400">${{ number_format($total, 2) }}</span>
                </div>

                <!-- Checkout Button -->
                <a href="{{ route('checkout') }}" class="block w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 rounded-lg text-center btn-hover transition-all mb-2">
                    Proceed to Checkout
                </a>

                <!-- Continue Shopping Button -->
                <button 
                    @click="cartOpen = false"
                    class="w-full text-amber-600 dark:text-amber-400 font-semibold py-2 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    @endif
</div>
