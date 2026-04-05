<?php

namespace App\Livewire\Cart;

use App\Models\Cart;
use Livewire\Component;
use Illuminate\Support\Facades\Auth;

class ShoppingCart extends Component
{
    public $cartItems = [];
    public $totalPrice = 0;

    public function mount()
    {
        $this->loadCart();
    }

    public function loadCart()
    {
        if (Auth::check()) {
            $cart = Cart::where('user_id', Auth::id())->first();
            if ($cart) {
                $this->cartItems = $cart->items ?? [];
                $this->totalPrice = $cart->total_price ?? 0;
            }
        }
    }

    public function removeItem($productId)
    {
        $this->cartItems = array_filter($this->cartItems, function ($item) use ($productId) {
            return $item['product_id'] !== $productId;
        });
        $this->updateCart();
    }

    public function updateQuantity($productId, $quantity)
    {
        foreach ($this->cartItems as &$item) {
            if ($item['product_id'] === $productId) {
                $item['quantity'] = $quantity;
                break;
            }
        }
        $this->updateCart();
    }

    public function checkout()
    {
        // Redirect to checkout page
        return redirect()->route('checkout');
    }

    private function updateCart()
    {
        if (Auth::check()) {
            Cart::updateOrCreate(
                ['user_id' => Auth::id()],
                [
                    'items' => $this->cartItems,
                    'total_price' => $this->calculateTotal(),
                ]
            );
            $this->totalPrice = $this->calculateTotal();
        }
    }

    private function calculateTotal()
    {
        $total = 0;
        foreach ($this->cartItems as $item) {
            $total += $item['price'] * $item['quantity'];
        }
        return $total;
    }

    public function render()
    {
        return view('livewire.cart.shopping-cart');
    }
}
