<div class="w-full space-y-3">
    <!-- Quantity Selector -->
    <div class="flex items-center justify-between bg-gray-100 dark:bg-slate-700 rounded-lg p-2">
        <button 
            wire:click="$set('quantity', quantity > 1 ? quantity - 1 : 1)"
            class="text-gray-600 dark:text-gray-300 px-3 py-1 hover:text-amber-600 transition-colors"
        >
            <i class="fas fa-minus text-sm"></i>
        </button>
        <span class="font-semibold">{{ $quantity }}</span>
        <button 
            wire:click="$set('quantity', quantity + 1)"
            class="text-gray-600 dark:text-gray-300 px-3 py-1 hover:text-amber-600 transition-colors"
        >
            <i class="fas fa-plus text-sm"></i>
        </button>
    </div>

    <!-- Add to Cart Button -->
    <button 
        wire:click="addToCart"
        class="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 rounded-xl font-bold btn-hover flex items-center justify-center gap-2 transition-all"
    >
        <i class="fas fa-shopping-bag"></i>
        Add to Cart
    </button>
</div>
