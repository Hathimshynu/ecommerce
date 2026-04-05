<?php

namespace App\Livewire\Checkout;

use Livewire\Component;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Str;

class CheckoutForm extends Component
{
    public $firstName = '';
    public $lastName = '';
    public $email = '';
    public $phone = '';
    public $address = '';
    public $city = '';
    public $state = '';
    public $zipCode = '';
    public $paymentMethod = 'card'; // card, upi, wallet, cod
    public $promoCode = '';
    public $cartItems = [];
    public $cartTotal = 0;
    public $discount = 0;
    public $tax = 0;
    public $finalTotal = 0;
    public $isProcessing = false;
    public $agreeTerms = false;

    protected $rules = [
        'firstName' => 'required|string|min:2',
        'lastName' => 'required|string|min:2',
        'email' => 'required|email',
        'phone' => 'required|regex:/^[0-9]{10}$/',
        'address' => 'required|string|min:5',
        'city' => 'required|string|min:2',
        'state' => 'required|string|min:2',
        'zipCode' => 'required|digits:6',
        'paymentMethod' => 'required|in:card,upi,wallet,cod',
        'agreeTerms' => 'accepted',
    ];

    public function mount()
    {
        $this->loadCartData();
        if (auth()->check()) {
            $user = auth()->user();
            $this->firstName = $user->first_name ?? '';
            $this->lastName = $user->last_name ?? '';
            $this->email = $user->email ?? '';
            $this->phone = $user->phone ?? '';
        }
    }

    public function loadCartData()
    {
        $this->cartItems = session()->get('cart', []);
        $this->calculateTotals();
    }

    public function calculateTotals()
    {
        $this->cartTotal = array_reduce($this->cartItems, function ($total, $item) {
            return $total + ($item['price'] * $item['quantity']);
        }, 0);

        $this->tax = round($this->cartTotal * 0.05, 2);
        $this->finalTotal = $this->cartTotal + $this->tax - $this->discount;
    }

    public function validatePromoCode()
    {
        // TODO: Implement promo code validation
        // For now, just a placeholder
        if ($this->promoCode === 'SAVE10') {
            $this->discount = round($this->cartTotal * 0.10, 2);
            $this->calculateTotals();
            $this->dispatch('showNotification', message: 'Promo code applied! You saved ₹' . $this->discount, type: 'success');
        } else {
            $this->discount = 0;
            $this->calculateTotals();
            $this->dispatch('showNotification', message: 'Invalid promo code', type: 'error');
        }
    }

    public function placeOrder()
    {
        $this->validate();

        if (empty($this->cartItems)) {
            $this->dispatch('showNotification', message: 'Your cart is empty', type: 'warning');
            return;
        }

        $this->isProcessing = true;

        try {
            // Create order
            $order = Order::create([
                'order_number' => 'ORD-' . strtoupper(Str::random(8)),
                'user_id' => auth()->id(),
                'first_name' => $this->firstName,
                'last_name' => $this->lastName,
                'email' => $this->email,
                'phone' => $this->phone,
                'address' => $this->address,
                'city' => $this->city,
                'state' => $this->state,
                'zip_code' => $this->zipCode,
                'subtotal' => $this->cartTotal,
                'tax' => $this->tax,
                'discount' => $this->discount,
                'total' => $this->finalTotal,
                'payment_method' => $this->paymentMethod,
                'status' => 'pending',
                'notes' => '',
            ]);

            // Create order items
            foreach ($this->cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'product_price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
            }

            // Clear cart
            session()->forget('cart');

            // Redirect to order confirmation
            session()->flash('success', 'Order placed successfully!');
            return redirect()->route('order.confirmation', $order->id);

        } catch (\Exception $e) {
            $this->isProcessing = false;
            $this->dispatch('showNotification', message: 'Error placing order: ' . $e->getMessage(), type: 'error');
        }
    }

    public function render()
    {
        return view('livewire.checkout.form');
    }
}
