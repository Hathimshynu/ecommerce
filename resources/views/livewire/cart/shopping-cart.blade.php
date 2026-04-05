<div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold mb-4">Shopping Cart</h2>

    @if(empty($cartItems))
        <p class="text-gray-500 text-center py-8">Your cart is empty</p>
    @else
        <div class="space-y-4 mb-6">
            @foreach($cartItems as $item)
                <div class="flex items-center justify-between border-b pb-4">
                    <div class="flex-1">
                        <h3 class="font-semibold">{{ $item['name'] ?? 'Product' }}</h3>
                        <p class="text-gray-600">${{ number_format($item['price'] ?? 0, 2) }}</p>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <input 
                            type="number" 
                            min="1" 
                            value="{{ $item['quantity'] ?? 1 }}"
                            wire:change="updateQuantity('{{ $item['product_id'] }}', $event.target.value)"
                            class="w-16 px-2 py-1 border rounded"
                        />
                    </div>

                    <button 
                        wire:click="removeItem('{{ $item['product_id'] }}')"
                        class="ml-4 text-red-600 hover:text-red-800"
                    >
                        Remove
                    </button>
                </div>
            @endforeach
        </div>

        <div class="border-t pt-4">
            <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-semibold">Total:</span>
                <span class="text-2xl font-bold text-blue-600">${{ number_format($totalPrice, 2) }}</span>
            </div>
            
            <button 
                wire:click="checkout"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            >
                Proceed to Checkout
            </button>
        </div>
    @endif
</div>
