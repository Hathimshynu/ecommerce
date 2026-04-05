<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use Illuminate\View\View;

class AdminDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin'); // Assuming you have an admin middleware
    }

    /**
     * Show the admin dashboard
     */
    public function index(): View
    {
        $stats = [
            'total_orders' => Order::count(),
            'total_revenue' => Order::sum('total'),
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'completed_orders' => Order::where('status', 'completed')->count(),
        ];

        $recent_orders = Order::latest()->limit(10)->get();
        $top_products = Product::withCount('order_items')
            ->orderBy('order_items_count', 'desc')
            ->limit(5)
            ->get();

        return view('admin.dashboard', compact('stats', 'recent_orders', 'top_products'));
    }

    /**
     * Show products management
     */
    public function products(): View
    {
        $products = Product::with('category')->paginate(15);
        $categories = Category::all();
        return view('admin.products.index', compact('products', 'categories'));
    }

    /**
     * Show orders management
     */
    public function orders(): View
    {
        $orders = Order::latest()->paginate(15);
        return view('admin.orders.index', compact('orders'));
    }

    /**
     * Show categories management
     */
    public function categories(): View
    {
        $categories = Category::paginate(15);
        return view('admin.categories.index', compact('categories'));
    }
}
