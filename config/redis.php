<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Redis Data Stores
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the Redis stores needed by your application.
    | You may use either a "single" Redis instance or a "cluster" that
    | operates as a Redis Sentinel cluster for high availability.
    |
    */

    'client' => env('REDIS_CLIENT', 'phpredis'),

    'options' => [
        'cluster' => env('REDIS_CLUSTER', 'redis'),
        'prefix' => env('REDIS_PREFIX', 'laravel_db'),
    ],

    'default' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', 6379),
        'database' => env('REDIS_DB', 0),
    ],

    'cache' => [
        'host' => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD'),
        'port' => env('REDIS_PORT', 6379),
        'database' => env('REDIS_CACHE_DB', 1),
    ],

];
