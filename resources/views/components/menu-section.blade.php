<!-- Menu Section with Category Filters -->
<section id="menu" class="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16 space-y-4">
            <p class="text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Discover</p>
            <h2 class="text-5xl font-bold text-gray-900 dark:text-white">
                Our Premium <span class="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Collection</span>
            </h2>
            <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Handpicked selections from around the world, crafted to perfection
            </p>
        </div>

        <!-- Category Filter Tabs -->
        <livewire:menu.category-filter />

        <!-- Products Grid -->
        <div class="mt-12">
            <livewire:menu.product-grid />
        </div>
    </div>
</section>
