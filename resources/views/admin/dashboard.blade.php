@extends('layout')

@section('title', 'Admin Dashboard - BrewCraft')

@section('content')
<div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
    <div class="container mx-auto max-w-7xl">
        <!-- Header -->
        <div class="mb-12">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-400">Manage your coffee shop business</p>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Total Orders -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Orders</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $stats['total_orders'] ?? 0 }}</h3>
                    </div>
                    <div class="text-4xl opacity-50">📦</div>
                </div>
            </div>

            <!-- Total Revenue -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Revenue</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white">₹{{ number_format($stats['total_revenue'] ?? 0, 2) }}</h3>
                    </div>
                    <div class="text-4xl opacity-50">💰</div>
                </div>
            </div>

            <!-- Total Products -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Products</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $stats['total_products'] ?? 0 }}</h3>
                    </div>
                    <div class="text-4xl opacity-50">☕</div>
                </div>
            </div>

            <!-- Pending Orders -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Pending Orders</p>
                        <h3 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $stats['pending_orders'] ?? 0 }}</h3>
                    </div>
                    <div class="text-4xl opacity-50">⏳</div>
                </div>
            </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Recent Orders -->
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Order ID</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Customer</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Amount</th>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                @forelse($recent_orders as $order)
                                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                        <td class="px-6 py-4 text-sm font-mono text-amber-600 dark:text-amber-400">{{ $order->order_number }}</td>
                                        <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">{{ $order->first_name }} {{ $order->last_name }}</td>
                                        <td class="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">₹{{ number_format($order->total, 2) }}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <span class="px-3 py-1 rounded-full text-xs font-bold {{ $order->status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' }}">
                                                {{ ucfirst($order->status) }}
                                            </span>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="4" class="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
                                            No orders yet
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Top Products -->
            <div>
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Top Products</h2>
                    </div>
                    <div class="space-y-4 p-6">
                        @forelse($top_products as $product)
                            <div class="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                <img src="{{ $product->image ?? 'https://via.placeholder.com/50' }}" alt="{{ $product->name }}" class="w-12 h-12 rounded-lg object-cover">
                                <div class="flex-1">
                                    <p class="text-sm font-bold text-gray-900 dark:text-white">{{ $product->name }}</p>
                                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ $product->order_items_count ?? 0 }} orders</p>
                                </div>
                                <p class="text-sm font-bold text-amber-600 dark:text-amber-400">₹{{ number_format($product->price, 2) }}</p>
                            </div>
                        @empty
                            <p class="text-center text-gray-600 dark:text-gray-400 py-8">No products sold yet</p>
                        @endforelse
                    </div>
                </div>
            </div>
        </div>

        <!-- Management Links -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <a href="{{ route('admin.products') }}" class="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div class="text-4xl mb-4">📋</div>
                <h3 class="text-2xl font-bold mb-2">Manage Products</h3>
                <p class="text-amber-100">Add, edit, or remove coffee products</p>
            </a>

            <a href="{{ route('admin.orders') }}" class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div class="text-4xl mb-4">📦</div>
                <h3 class="text-2xl font-bold mb-2">Manage Orders</h3>
                <p class="text-blue-100">View and process customer orders</p>
            </a>

            <a href="{{ route('admin.categories') }}" class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-8 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <div class="text-4xl mb-4">🏷️</div>
                <h3 class="text-2xl font-bold mb-2">Manage Categories</h3>
                <p class="text-green-100">Organize product categories</p>
            </a>
        </div>
    </div>
</div>
@endsection
