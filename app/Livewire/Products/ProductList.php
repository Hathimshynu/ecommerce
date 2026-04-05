<?php

namespace App\Livewire\Products;

use App\Models\Product;
use Livewire\Component;
use Livewire\WithPagination;

class ProductList extends Component
{
    use WithPagination;

    public string $search = '';
    public string $category = '';
    public string $sortBy = 'latest';

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function render()
    {
        $query = Product::where('is_active', true);

        if ($this->search) {
            $query->where('name', 'like', '%' . $this->search . '%')
                  ->orWhere('description', 'like', '%' . $this->search . '%');
        }

        if ($this->category) {
            $query->where('category', $this->category);
        }

        if ($this->sortBy === 'price_low') {
            $query->orderBy('price', 'asc');
        } elseif ($this->sortBy === 'price_high') {
            $query->orderBy('price', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return view('livewire.products.product-list', [
            'products' => $query->paginate(12),
            'categories' => Product::distinct()->pluck('category'),
        ]);
    }
}
