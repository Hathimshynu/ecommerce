@extends('layout')

@section('title', 'Order Confirmation')

@section('content')
    <div class="max-w-md mx-auto text-center py-16">
        <div class="mb-6">
            <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
        </div>
        
        <h1 class="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p class="text-gray-600 mb-6">Thank you for your purchase. Your order has been successfully placed.</p>
        
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <p class="text-gray-500 mb-2">Order ID</p>
            <p class="text-2xl font-semibold mb-4">{{ $orderId }}</p>
            <p class="text-sm text-gray-500">We'll send you updates about your order via email.</p>
        </div>

        <a href="{{ route('home') }}" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">
            Continue Shopping
        </a>
    </div>
@endsection
