<div class="space-y-4">
    <div class="flex gap-4 mb-6">
        <input 
            type="text" 
            wire:model.live="search" 
            placeholder="Search products..." 
            class="flex-1 px-4 py-2 border rounded-lg"
        />
        
        <select wire:model.live="category" class="px-4 py-2 border rounded-lg">
            <option value="">All Categories</option>
            @foreach($categories as $cat)
                <option value="{{ $cat }}">{{ $cat }}</option>
            @endforeach
        </select>

        <select wire:model.live="sortBy" class="px-4 py-2 border rounded-lg">
            <option value="latest">Latest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
        </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @forelse($products as $product)
            @livewire('products.product-card', ['product' => $product], key($product->id))
        @empty
            <div class="col-span-full text-center py-8">
                <p class="text-gray-500">No products found</p>
            </div>
        @endforelse
    </div>

    <div class="mt-6">
        {{ $products->links() }}
    </div>
</div>
