<?php

namespace App\Livewire\Cart;

use Livewire\Component;
use App\Models\Product;

class AddToCart extends Component
{
    public Product $product;
    public $quantity = 1;

    public function addToCart()
    {
        $cart = session()->get('cart', []);
        
        if (isset($cart[$this->product->id])) {
            $cart[$this->product->id]['quantity'] += $this->quantity;
        } else {
            $cart[$this->product->id] = [
                'product_id' => $this->product->id,
                'name' => $this->product->name,
                'price' => $this->product->price,
                'image_url' => $this->product->image_url,
                'quantity' => $this->quantity,
            ];
        }

        session()->put('cart', $cart);
        $this->dispatch('cart-updated');
        
        // Show success notification
        $this->dispatch('notify', type: 'success', message: $this->product->name . ' added to cart!');
    }

    public function render()
    {
        return view('livewire.cart.add-to-cart');
    }
}
