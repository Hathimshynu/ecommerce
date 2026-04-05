<?php

namespace App\Livewire\Cart;

use Livewire\Component;

class Badge extends Component
{
    #[Computed]
    public function count()
    {
        $cart = session()->get('cart', []);
        return array_reduce($cart, function($total, $item) {
            return $total + ($item['quantity'] ?? 0);
        }, 0);
    }

    #[\Livewire\Attributes\On('cart-updated')]
    public function refreshCart()
    {
        // Refresh component
    }

    public function render()
    {
        return view('livewire.cart.badge', [
            'count' => $this->count()
        ]);
    }
}
