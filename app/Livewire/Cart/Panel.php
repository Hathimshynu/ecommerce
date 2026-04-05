<?php

namespace App\Livewire\Cart;

use Livewire\Component;

class Panel extends Component
{
    public $cart = [];

    public function mount()
    {
        $this->loadCart();
    }

    public function loadCart()
    {
        $this->cart = session()->get('cart', []);
    }

    public function updateQuantity($productId, $quantity)
    {
        $cart = session()->get('cart', []);
        
        if ($quantity <= 0) {
            unset($cart[$productId]);
        } else {
            $cart[$productId]['quantity'] = $quantity;
        }

        session()->put('cart', $cart);
        $this->loadCart();
        $this->dispatch('cart-updated');
    }

    public function removeItem($productId)
    {
        $cart = session()->get('cart', []);
        unset($cart[$productId]);
        session()->put('cart', $cart);
        $this->loadCart();
        $this->dispatch('cart-updated');
    }

    public function getTotal()
    {
        return array_reduce($this->cart, function($total, $item) {
            return $total + ($item['price'] * $item['quantity']);
        }, 0);
    }

    public function getSubtotal()
    {
        return $this->getTotal();
    }

    public function getTax()
    {
        return $this->getSubtotal() * 0.08; // 8% tax
    }

    public function getFinalTotal()
    {
        return $this->getSubtotal() + $this->getTax() + 2.50; // $2.50 delivery fee
    }

    #[\Livewire\Attributes\On('cart-updated')]
    public function onCartUpdated()
    {
        $this->loadCart();
    }

    public function render()
    {
        return view('livewire.cart.panel', [
            'subtotal' => $this->getSubtotal(),
            'tax' => $this->getTax(),
            'deliveryFee' => 2.50,
            'total' => $this->getFinalTotal(),
        ]);
    }
}
