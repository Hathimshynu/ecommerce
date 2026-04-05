<div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
    <div class="container mx-auto max-w-6xl">
        <!-- Header -->
        <div class="mb-12 text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Complete Your Order</h1>
            <p class="text-gray-600 dark:text-gray-400">Just a few steps to enjoy your order</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Checkout Form -->
            <div class="lg:col-span-2">
                <form wire:submit.prevent="placeOrder" class="space-y-8">
                    <!-- Personal Information -->
                    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h2>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- First Name -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                                <input 
                                    type="text"
                                    wire:model="firstName"
                                    class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="John">
                                @error('firstName') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
                            </div>

                            <!-- Last Name -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                                <input 
                                    type="text"
                                    wire:model="lastName"
                                    class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="Doe">
                                @error('lastName') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
                            </div>

                            <!-- Email -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                                <input 
                                    type="email"
                                    wire:model="email"
                                    class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="john@example.com">
                                @error('email') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
                            </div>

                            <!-- Phone -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone *</label>
                                <input 
                                    type="tel"
                                    wire:model="phone"
                                    class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="9876543210">
                                @error('phone') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
                            </div>
                        </div>
                    </div>

                    <!-- Delivery Address -->
                    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Delivery Address</h2>
                        
                        <div class="space-y-6">
                            <!-- Address -->
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Street Address *</label>
                                <textarea 
                                    wire:model="address"
                                    rows="3"
                                    class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="123 Main St, Apt 4B"></textarea>
                                @error('address') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- City -->
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City *</label>
                                    <input 
                                        type="text"
                                        wire:model="city"
                                        class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="New York">
                                    @error('city') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
                                </div>

                                <!-- State -->
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State *</label>
                                    <input 
                                        type="text"
                                        wire:model="state"
                                        class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="NY">
                                    @error('state') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
                                </div>

                                <!-- Zip Code -->
                                <div>
                                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Zip Code *</label>
                                    <input 
                                        type="text"
                                        wire:model="zipCode"
                                        class="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-amber-500 focus:outline-none transition-colors"
                                        placeholder="100001">
                                    @error('zipCode') <p class="text-red-500 text-sm mt-1">{{ $message }}</p> @enderror
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Method -->
                    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20">
                        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Method</h2>
                        
                        <div class="space-y-3">
                            @php $methods = ['card' => ['name' => '💳 Credit/Debit Card', 'icon' => '💳'], 'upi' => ['name' => '📱 UPI', 'icon' => '📱'], 'wallet' => ['name' => '💰 Digital Wallet', 'icon' => '💰'], 'cod' => ['name' => '🚚 Cash on Delivery', 'icon' => '🚚']]; @endphp
                            
                            @foreach($methods as $key => $method)
                                <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all {{ $paymentMethod === $key ? 'border-amber-500 bg-amber-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600 hover:border-amber-300' }}">
                                    <input 
                                        type="radio" 
                                        wire:model="paymentMethod" 
                                        value="{{ $key }}"
                                        class="w-5 h-5 text-amber-500 cursor-pointer">
                                    <div class="ml-4">
                                        <p class="font-semibold text-gray-900 dark:text-white">{{ $method['name'] }}</p>
                                    </div>
                                </label>
                            @endforeach
                        </div>
                        @error('paymentMethod') <p class="text-red-500 text-sm mt-2">{{ $message }}</p> @enderror
                    </div>

                    <!-- Terms -->
                    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20">
                        <label class="flex items-start gap-4 cursor-pointer">
                            <input 
                                type="checkbox" 
                                wire:model="agreeTerms"
                                class="mt-1 w-5 h-5 text-amber-500 rounded cursor-pointer">
                            <div>
                                <p class="text-gray-700 dark:text-gray-300">I agree to the <a href="#" class="text-amber-600 hover:text-amber-700 font-semibold">Terms & Conditions</a> and <a href="#" class="text-amber-600 hover:text-amber-700 font-semibold">Privacy Policy</a></p>
                            </div>
                        </label>
                        @error('agreeTerms') <p class="text-red-500 text-sm mt-2">{{ $message }}</p> @enderror
                    </div>

                    <!-- Submit Button -->
                    <button 
                        type="submit"
                        wire:loading.attr="disabled"
                        class="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg">
                        <span wire:loading.remove>Place Order</span>
                        <span wire:loading>Processing...</span>
                    </button>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
                <div class="sticky top-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 dark:border-gray-700/20 space-y-6">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Order Summary</h2>

                    <!-- Items -->
                    <div class="space-y-3 max-h-64 overflow-y-auto">
                        @forelse($cartItems as $item)
                            <div class="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                                <span>{{ $item['name'] }} (×{{ $item['quantity'] }})</span>
                                <span class="font-semibold">₹{{ number_format($item['price'] * $item['quantity'], 2) }}</span>
                            </div>
                        @empty
                            <p class="text-gray-500 text-center py-8">Your cart is empty</p>
                        @endforelse
                    </div>

                    <!-- Promo Code -->
                    <div class="border-t border-gray-300 dark:border-gray-600 pt-6">
                        <div class="flex gap-2">
                            <input 
                                type="text"
                                wire:model="promoCode"
                                placeholder="Promo code"
                                class="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                            <button 
                                type="button"
                                wire:click="validatePromoCode"
                                class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-semibold text-sm">
                                Apply
                            </button>
                        </div>
                    </div>

                    <!-- Totals -->
                    <div class="border-t border-gray-300 dark:border-gray-600 pt-6 space-y-3 text-gray-700 dark:text-gray-300">
                        <div class="flex justify-between">
                            <span>Subtotal:</span>
                            <span class="font-semibold">₹{{ number_format($cartTotal, 2) }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Tax (5%):</span>
                            <span class="font-semibold">₹{{ number_format($tax, 2) }}</span>
                        </div>
                        @if($discount > 0)
                            <div class="flex justify-between text-green-600 dark:text-green-400">
                                <span>Discount:</span>
                                <span class="font-semibold">-₹{{ number_format($discount, 2) }}</span>
                            </div>
                        @endif
                    </div>

                    <!-- Final Total -->
                    <div class="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl p-4 text-center">
                        <p class="text-sm opacity-90">Total Amount</p>
                        <p class="text-3xl font-bold">₹{{ number_format($finalTotal, 2) }}</p>
                    </div>

                    <!-- Continue Shopping -->
                    <a 
                        href="/"
                        class="block w-full text-center py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        ← Back to Menu
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
