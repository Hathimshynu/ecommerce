<!-- Product Grid -->
<div class="space-y-8">
    @if($products->count() > 0)
        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style="grid-auto-rows: max-content;">
            @foreach($products as $product)
                <x-product-card :product="$product" />
            @endforeach
        </div>

        <!-- Pagination -->
        @if($products->hasPages())
            <div class="flex justify-center mt-12">
                {{ $products->links() }}
            </div>
        @endif
    @else
        <!-- Empty State -->
        <div class="text-center py-20">
            <div class="text-6xl mb-6">🔍</div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">No products found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-8">
                @if($searchQuery)
                    We couldn't find any products matching "{{ $searchQuery }}"
                @else
                    No products available in this category
                @endif
            </p>
            <button 
                @click="window.location.reload()"
                class="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
                Try Again
            </button>
        </div>
    @endif
</div>
