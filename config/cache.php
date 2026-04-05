<?php

return [

    'default' => 'array',

    'prefix' => env('CACHE_PREFIX', 'laravel_cache'),

    'stores' => [

        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'cache',
            'lock_connection' => 'default',
        ],

    ],

    'ttl' => env('CACHE_TTL'),

];
