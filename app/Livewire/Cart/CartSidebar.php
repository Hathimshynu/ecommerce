<?php

namespace App\Livewire\Cart;

use Livewire\Component;
use Livewire\Attributes\On;
use Illuminate\Support\Collection;

class CartSidebar extends Component
{
    public $cartItems = [];
    public $showCart = false;
    public $cartTotal = 0;
    public $itemCount = 0;

    protected $listeners = ['addToCart', 'removeFromCart', 'updateQuantity', 'cartUpdated'];

    public function mount()
    {
        $this->loadCart();
    }

    public function loadCart()
    {
        $this->cartItems = session()->get('cart', []);
        $this->calculateTotals();
    }

    #[On('addToCart')]
    public function addToCart($productId, $quantity = 1)
    {
        $product = \App\Models\Product::findOrFail($productId);
        $cart = session()->get('cart', []);

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity'] += $quantity;
        } else {
            $cart[$productId] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'image' => $product->image,
                'quantity' => $quantity,
            ];
        }

        session()->put('cart', $cart);
        $this->loadCart();
        $this->dispatch('cartUpdated');
    }

    public function removeFromCart($productId)
    {
        $cart = session()->get('cart', []);
        unset($cart[$productId]);
        session()->put('cart', $cart);
        $this->loadCart();
        $this->dispatch('cartUpdated');
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
        $this->dispatch('cartUpdated');
    }

    public function clearCart()
    {
        session()->forget('cart');
        $this->loadCart();
        $this->dispatch('cartUpdated');
    }

    public function calculateTotals()
    {
        $this->cartTotal = array_reduce($this->cartItems, function ($total, $item) {
            return $total + ($item['price'] * $item['quantity']);
        }, 0);

        $this->itemCount = array_reduce($this->cartItems, function ($count, $item) {
            return $count + $item['quantity'];
        }, 0);
    }

    public function checkout()
    {
        if (empty($this->cartItems)) {
            $this->dispatch('showNotification', message: 'Your cart is empty', type: 'warning');
            return;
        }
        return redirect()->route('checkout');
    }

    public function render()
    {
        return view('livewire.cart.sidebar');
    }
}
