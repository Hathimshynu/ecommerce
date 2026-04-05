<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class CheckoutController extends Controller
{
    public function show()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        return view('checkout');
    }

    public function process()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Create order from cart
        $order = Order::create([
            'user_id' => Auth::id(),
            'order_number' => 'ORD-' . time(),
            'status' => 'pending',
            'items' => session()->get('cart_items', []),
        ]);

        return redirect()->route('order.thank-you', $order->id);
    }
}
