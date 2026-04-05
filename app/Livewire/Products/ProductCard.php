<?php

namespace App\Livewire\Products;

use App\Models\Product;
use Livewire\Component;

class ProductCard extends Component
{
    public Product $product;

    public function addToCart()
    {
        $this->dispatch('add-to-cart', productId: $this->product->id);
        $this->dispatch('notify', message: 'Product added to cart!');
    }

    public function render()
    {
        return view('livewire.products.product-card');
    }
}
