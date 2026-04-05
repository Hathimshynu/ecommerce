<div class="space-y-8">
    <!-- Search and Filter Bar -->
    <div class="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <!-- Search Input with Glassmorphism -->
        <div class="flex-1 max-w-2xl">
            <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input 
                    type="text" 
                    wire:model.live="searchQuery" 
                    placeholder="Search coffees, drinks, snacks..."
                    class="w-full pl-12 pr-6 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-white/30 dark:border-gray-700/30 focus:border-amber-500 focus:outline-none transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90 placeholder-gray-500 dark:placeholder-gray-400"
                >
            </div>
        </div>

        <!-- Clear Filters Button -->
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($selectedCategory || $searchQuery): ?>
            <button 
                wire:click="clearFilters"
                class="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
            >
                ✕ Clear Filters
            </button>
        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </div>

    <!-- Category Tabs with Modern Styling -->
    <div class="flex flex-wrap gap-3 pb-6 overflow-x-auto scrollbar-hide">
        <button 
            wire:click="selectCategory(null)"
            class="px-6 py-3 rounded-full whitespace-nowrap font-semibold transition-all duration-300 hover:scale-105 active:scale-95 <?php echo e(!$selectedCategory ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30 text-gray-800 dark:text-white hover:shadow-lg'); ?>"
        >
            ☕ All Items
        </button>

        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $categories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $category): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <button 
                wire:click="selectCategory(<?php echo e($category->id); ?>)"
                class="px-6 py-3 rounded-full whitespace-nowrap font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 <?php echo e($selectedCategory == $category->id ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/30 dark:border-gray-700/30 text-gray-800 dark:text-white hover:shadow-lg'); ?>"
            >
                <span class="text-lg"><?php echo e($category->icon ?? '☕'); ?></span>
                <span><?php echo e($category->name); ?></span>
            </button>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </div>

    <!-- Products Grid -->
    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($products->count() > 0): ?>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__currentLoopData = $products; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="group card-3d glass dark:glass-dark rounded-2xl overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <!-- Product Image -->
                    <div class="relative h-56 overflow-hidden bg-gray-200 dark:bg-slate-700">
                        <img 
                            src="<?php echo e($product->image_url); ?>" 
                            alt="<?php echo e($product->name); ?>"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        >
                        
                        <!-- Badge -->
                        <div class="absolute top-3 right-3 space-y-2">
                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->is_featured): ?>
                                <div class="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <i class="fas fa-star text-xs"></i> Featured
                                </div>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            
                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->getDiscountPercentage() > 0): ?>
                                <div class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    -<?php echo e($product->getDiscountPercentage()); ?>%
                                </div>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->stock > 0 && $product->stock <= 10): ?>
                                <div class="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    Only <?php echo e($product->stock); ?> left
                                </div>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                        </div>

                        <!-- Rating -->
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->rating): ?>
                            <div class="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                <i class="fas fa-star text-yellow-400"></i>
                                <?php echo e(number_format($product->rating, 1)); ?>

                            </div>
                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                    </div>

                    <!-- Product Info -->
                    <div class="p-5">
                        <!-- Category -->
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->category): ?>
                            <span class="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">
                                <?php echo e($product->category->name); ?>

                            </span>
                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                        <!-- Name -->
                        <h3 class="text-lg font-bold mb-2 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            <?php echo e($product->name); ?>

                        </h3>

                        <!-- Description -->
                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            <?php echo e($product->description); ?>

                        </p>

                        <!-- Features -->
                        <div class="flex gap-2 mb-4 flex-wrap text-xs">
                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->caffeine_level): ?>
                                <span class="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                                    <?php echo e(ucfirst($product->caffeine_level)); ?> Caffeine
                                </span>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->temperature): ?>
                                <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                                    <?php echo e(ucfirst($product->temperature)); ?>

                                </span>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->calories): ?>
                                <span class="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full">
                                    <?php echo e($product->calories); ?> cal
                                </span>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                        </div>

                        <!-- Price -->
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <span class="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                    $<?php echo e(number_format($product->price, 2)); ?>

                                </span>
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->original_price && $product->original_price > $product->price): ?>
                                    <span class="ml-2 text-sm line-through text-gray-500">
                                        $<?php echo e(number_format($product->original_price, 2)); ?>

                                    </span>
                                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            </div>
                        </div>

                        <!-- Stock Status -->
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($product->stock <= 0): ?>
                            <button disabled class="w-full bg-gray-400 text-white py-3 rounded-xl font-bold cursor-not-allowed">
                                Out of Stock
                            </button>
                        <?php else: ?>
                            <!-- Add to Cart Button -->
                            <?php
$__split = function ($name, $params = []) {
    return [$name, $params];
};
[$__name, $__params] = $__split('cart.add-to-cart', ['product' => $product]);

$__key = null;

$__key ??= \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::generateKey('lw-1792719771-0', $__key);

$__html = app('livewire')->mount($__name, $__params, $__key);

echo $__html;

unset($__html);
unset($__key);
unset($__name);
unset($__params);
unset($__split);
if (isset($__slots)) unset($__slots);
?>
                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                    </div>
                </div>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
        </div>
    <?php else: ?>
        <!-- Empty State -->
        <div class="text-center py-16">
            <i class="fas fa-inbox text-6xl text-gray-300 dark:text-gray-700 mb-4 block"></i>
            <h3 class="text-2xl font-bold mb-2">No Products Found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button 
                wire:click="clearFilters"
                class="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold btn-hover"
            >
                Clear Filters
            </button>
        </div>
    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
</div>
<?php /**PATH D:\Projects\ecommerce\resources\views/livewire/menu/category-filter.blade.php ENDPATH**/ ?>