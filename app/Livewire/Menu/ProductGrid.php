<?php

namespace App\Livewire\Menu;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Product;

class ProductGrid extends Component
{
    use WithPagination;

    public $selectedCategory = null;
    public $searchQuery = '';

    protected $listeners = [
        'categorySelected' => 'filterByCategory',
        'searchUpdated' => 'updateSearch',
        'categoriesReset' => 'resetFilters',
    ];

    public function filterByCategory($categoryId)
    {
        $this->selectedCategory = $categoryId;
        $this->resetPage();
    }

    public function updateSearch($query)
    {
        $this->searchQuery = $query;
        $this->resetPage();
    }

    public function resetFilters()
    {
        $this->selectedCategory = null;
        $this->searchQuery = '';
        $this->resetPage();
    }

    public function addToCart($productId)
    {
        $product = Product::findOrFail($productId);

        $cart = session()->get('cart', []);
        if (isset($cart[$productId])) {
            $cart[$productId]['quantity']++;
        } else {
            $cart[$productId] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'image' => $product->image,
                'quantity' => 1,
            ];
        }

        session()->put('cart', $cart);
        $this->dispatch('cartUpdated');
        $this->dispatch('showNotification', message: ucfirst($product->name) . ' added to cart!', type: 'success');
    }

    public function render()
    {
        $query = Product::where('is_active', true)
            ->with('category')
            ->orderBy('is_featured', 'desc');

        if ($this->selectedCategory) {
            $query->where('category_id', $this->selectedCategory);
        }

        if ($this->searchQuery) {
            $query->where(function ($q) {
                $q->where('name', 'like', "%{$this->searchQuery}%")
                  ->orWhere('description', 'like', "%{$this->searchQuery}%");
            });
        }

        $products = $query->paginate(12);

        return view('livewire.menu.product-grid', [
            'products' => $products,
        ]);
    }
}
