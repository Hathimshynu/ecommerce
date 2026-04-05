<div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div class="h-48 bg-gray-200 flex items-center justify-center">
        @if($product->image_url)
            <img src="{{ $product->image_url }}" alt="{{ $product->name }}" class="w-full h-full object-cover">
        @else
            <span class="text-gray-400">No Image</span>
        @endif
    </div>
    
    <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">{{ $product->name }}</h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ $product->description }}</p>
        
        <div class="flex justify-between items-center mb-3">
            <span class="text-2xl font-bold text-blue-600">${{ number_format($product->price, 2) }}</span>
            <span class="text-sm text-gray-500">Stock: {{ $product->stock }}</span>
        </div>
        
        <button 
            wire:click="addToCart"
            @if($product->stock <= 0) disabled @endif
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
        >
            {{ $product->stock > 0 ? 'Add to Cart' : 'Out of Stock' }}
        </button>
    </div>
</div>
