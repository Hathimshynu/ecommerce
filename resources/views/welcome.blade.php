@extends('layout')

@section('title', 'Welcome to BrewCraft')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div class="text-center">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-4">Welcome to BrewCraft</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">Premium Coffee & Cool Drinks</p>
        <div class="flex gap-4 justify-center">
            <a href="{{ route('login') }}" class="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg">Login</a>
            <a href="{{ route('register') }}" class="px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg">Register</a>
        </div>
    </div>
</div>
@endsection
