<div class="space-y-6">
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
</div>
<?php /**PATH D:\Projects\ecommerce\resources\views/livewire/menu/category-filter.blade.php ENDPATH**/ ?>