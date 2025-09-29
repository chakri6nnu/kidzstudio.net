<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Temporarily allow all origins to verify CORS behavior. You can switch back to env-based list later.
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    // Allow common headers incl. Authorization for Bearer tokens
    'allowed_headers' => ['*'],

    // Optionally expose Authorization so clients can read it if ever returned
    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    // Keep false for token (Bearer) auth. Set to true only if using cookie auth.
    'supports_credentials' => false,

];
