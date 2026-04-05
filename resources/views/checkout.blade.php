@extends('layout')

@section('title', 'Checkout - CoffeeHub')

@section('content')
    <div class="max-w-6xl mx-auto px-4 py-12">
        <!-- Page Header -->
        <div class="mb-12">
            <h1 class="text-5xl font-bold mb-2">Secure Checkout</h1>
            <p class="text-gray-600 dark:text-gray-400 text-lg">Complete your order and enjoy your favorites</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Checkout Form -->
            <div class="lg:col-span-2 space-y-8">
                <!-- Delivery Information -->
                <div class="glass dark:glass-dark rounded-2xl p-8">
                    <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
                        <div class="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                        Delivery Information
                    </h2>

                    <form action="{{ route('checkout.process') }}" method="POST" class="space-y-6">
                        @csrf
                        
                        <!-- Full Name -->
                        <div>
                            <label class="block text-sm font-semibold mb-3">Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value="{{ auth()->user()->name ?? '' }}" 
                                required
                                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                placeholder="John Doe"
                            >
                            @error('name') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="block text-sm font-semibold mb-3">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                value="{{ auth()->user()->email ?? '' }}" 
                                required
                                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                placeholder="john@example.com"
                            >
                            @error('email') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>

                        <!-- Phone -->
                        <div>
                            <label class="block text-sm font-semibold mb-3">Phone Number</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                value="{{ auth()->user()->phone ?? '' }}" 
                                required
                                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                placeholder="+1 (555) 123-4567"
                            >
                            @error('phone') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>

                        <!-- Address -->
                        <div>
                            <label class="block text-sm font-semibold mb-3">Delivery Address</label>
                            <input 
                                type="text" 
                                name="address" 
                                value="{{ auth()->user()->address ?? '' }}" 
                                required
                                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                placeholder="123 Main Street"
                            >
                            @error('address') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>

                        <!-- City, State, ZIP -->
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-semibold mb-3">City</label>
                                <input 
                                    type="text" 
                                    name="city" 
                                    value="{{ auth()->user()->city ?? '' }}" 
                                    required
                                    class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="New York"
                                >
                                @error('city') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                            </div>
                            <div>
                                <label class="block text-sm font-semibold mb-3">State</label>
                                <input 
                                    type="text" 
                                    name="state" 
                                    value="{{ auth()->user()->state ?? '' }}" 
                                    required
                                    class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="NY"
                                >
                                @error('state') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                            </div>
                            <div>
                                <label class="block text-sm font-semibold mb-3">ZIP Code</label>
                                <input 
                                    type="text" 
                                    name="zip_code" 
                                    value="{{ auth()->user()->zip_code ?? '' }}" 
                                    required
                                    class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                    placeholder="10001"
                                >
                                @error('zip_code') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                            </div>
                        </div>

                        <!-- Country -->
                        <div>
                            <label class="block text-sm font-semibold mb-3">Country</label>
                            <input 
                                type="text" 
                                name="country" 
                                value="{{ auth()->user()->country ?? 'USA' }}" 
                                required
                                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                placeholder="United States"
                            >
                            @error('country') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                        </div>

                        <!-- Delivery Type -->
                        <div>
                            <label class="block text-sm font-semibold mb-3">Delivery Type</label>
                            <div class="space-y-3">
                                <label class="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-amber-500 cursor-pointer transition-colors">
                                    <input type="radio" name="delivery_type" value="delivery" checked class="w-4 h-4">
                                    <span class="ml-3 font-semibold">
                                        <i class="fas fa-motorcycle text-amber-500 mr-2"></i>Home Delivery
                                        <span class="text-gray-600 dark:text-gray-400 text-sm block ml-6">$2.50 • 30-45 minutes</span>
                                    </span>
                                </label>
                                <label class="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-amber-500 cursor-pointer transition-colors">
                                    <input type="radio" name="delivery_type" value="pickup" class="w-4 h-4">
                                    <span class="ml-3 font-semibold">
                                        <i class="fas fa-store text-blue-500 mr-2"></i>Pickup
                                        <span class="text-gray-600 dark:text-gray-400 text-sm block ml-6">Free • Ready in 15 minutes</span>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Special Instructions -->
                        <div>
                            <label class="block text-sm font-semibold mb-3">Special Instructions (Optional)</label>
                            <textarea 
                                name="special_instructions"
                                rows="3"
                                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none transition-colors"
                                placeholder="e.g., Extra hot, no sugar, allergies..."
                            ></textarea>
                        </div>

                        <!-- Payment Information -->
                        <div class="pt-6 border-t border-gray-200 dark:border-slate-700">
                            <h3 class="text-xl font-bold mb-4 flex items-center gap-3">
                                <div class="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                Payment Method
                            </h3>

                            <div class="space-y-3">
                                <label class="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-amber-500 cursor-pointer transition-colors">
                                    <input type="radio" name="payment_method" value="credit_card" checked class="w-4 h-4">
                                    <span class="ml-3 font-semibold">
                                        <i class="fas fa-credit-card text-amber-500 mr-2"></i>Credit/Debit Card
                                    </span>
                                </label>
                                <label class="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-amber-500 cursor-pointer transition-colors">
                                    <input type="radio" name="payment_method" value="paypal" class="w-4 h-4">
                                    <span class="ml-3 font-semibold">
                                        <i class="fab fa-paypal text-blue-500 mr-2"></i>PayPal
                                    </span>
                                </label>
                                <label class="flex items-center p-4 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 hover:border-amber-500 cursor-pointer transition-colors">
                                    <input type="radio" name="payment_method" value="apple_pay" class="w-4 h-4">
                                    <span class="ml-3 font-semibold">
                                        <i class="fab fa-apple text-gray-800 dark:text-gray-200 mr-2"></i>Apple Pay
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Terms & Place Order -->
                        <div class="pt-6 border-t border-gray-200 dark:border-slate-700 space-y-4">
                            <label class="flex items-start gap-3">
                                <input type="checkbox" required class="w-4 h-4 mt-1 rounded">
                                <span class="text-sm text-gray-600 dark:text-gray-400">
                                    I agree to the terms and conditions and privacy policy
                                </span>
                            </label>

                            <button 
                                type="submit"
                                class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 rounded-xl btn-hover text-lg transition-all flex items-center justify-center gap-2"
                            >
                                <i class="fas fa-lock text-sm"></i>
                                Complete Order Securely
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
                <div class="glass dark:glass-dark rounded-2xl p-6 sticky top-24 space-y-4">
                    <h3 class="text-xl font-bold flex items-center gap-2">
                        <i class="fas fa-receipt text-amber-500"></i>
                        Order Summary
                    </h3>

                    <!-- Cart Items -->
                    @php
                        $cart = session()->get('cart', []);
                        $subtotal = 0;
                    @endphp

                    @if(count($cart) > 0)
                        <div class="space-y-3 border-b border-gray-200 dark:border-slate-700 pb-4">
                            @foreach($cart as $item)
                                @php $subtotal += $item['price'] * $item['quantity']; @endphp
                                <div class="flex justify-between text-sm">
                                    <div>
                                        <p class="font-semibold line-clamp-1">{{ $item['name'] }}</p>
                                        <p class="text-gray-600 dark:text-gray-400">x{{ $item['quantity'] }}</p>
                                    </div>
                                    <p class="font-semibold">${{ number_format($item['price'] * $item['quantity'], 2) }}</p>
                                </div>
                            @endforeach
                        </div>

                        <!-- Pricing Breakdown -->
                        <div class="space-y-2 border-b border-gray-200 dark:border-slate-700 pb-4 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span>${{ number_format($subtotal, 2) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                                <span>${{ number_format($subtotal * 0.08, 2) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                                <span>$2.50</span>
                            </div>
                        </div>

                        <!-- Total -->
                        <div class="pt-4">
                            <div class="flex justify-between items-center mb-4">
                                <span class="font-bold text-lg">Total</span>
                                <span class="text-3xl font-bold text-amber-600 dark:text-amber-400">
                                    ${{ number_format($subtotal + ($subtotal * 0.08) + 2.50, 2) }}
                                </span>
                            </div>

                            <!-- Security Badge -->
                            <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center text-xs text-green-700 dark:text-green-400 flex items-center justify-center gap-2">
                                <i class="fas fa-shield-alt"></i>
                                100% Secure & Encrypted
                            </div>
                        </div>
                    @else
                        <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                            <i class="fas fa-shopping-bag text-4xl mb-3 block opacity-50"></i>
                            <p>Your cart is empty</p>
                            <a href="{{ route('home') }}" class="text-amber-600 dark:text-amber-400 font-semibold mt-2 inline-block">Continue Shopping</a>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
@endsection
                        <input type="text" name="country" required class="w-full px-4 py-2 border rounded-lg">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Payment Method</label>
                    <select name="payment_method" required class="w-full px-4 py-2 border rounded-lg">
                        <option value="">Select Payment Method</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="bank_transfer">Bank Transfer</option>
                    </select>
                </div>

                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
                    Place Order
                </button>
            </form>
        </div>

        <div>
            @livewire('cart.shopping-cart')
        </div>
    </div>
@endsection
