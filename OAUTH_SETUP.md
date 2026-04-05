# Laravel Breeze & Socialite OAuth Setup Guide

## Overview
This guide will help you set up OAuth authentication with Google and GitHub for your BrewCraft Laravel application.

## Prerequisites
- Laravel Breeze is installed
- Laravel Socialite is installed
- A Google Cloud Console project
- A GitHub OAuth application

## Setting Up Google OAuth

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the Google+ API:
   - Search for "Google+ API" in the search bar
   - Click on it and press "Enable"

### Step 2: Create OAuth 2.0 Credentials
1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Add authorized redirect URIs:
   ```
   http://ecommerce.local/auth/google/callback
   ```
5. Click "Create" and copy your credentials

### Step 3: Update .env File
Add the following to your `.env` file:
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://ecommerce.local/auth/google/callback
```

## Setting Up GitHub OAuth

### Step 1: Register a New OAuth Application
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: BrewCraft Coffee Shop
   - **Homepage URL**: `http://ecommerce.local`
   - **Authorization callback URL**: `http://ecommerce.local/auth/github/callback`
4. Click "Register application"

### Step 2: Generate Client Secret
1. On the application details page, click "Generate a new client secret"
2. Copy both the Client ID and Client Secret

### Step 3: Update .env File
Add the following to your `.env` file:
```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://ecommerce.local/auth/github/callback
```

## Database Configuration

The following columns have been added to the users table:
- `google_id` - Stores the Google user ID
- `github_id` - Stores the GitHub user ID
- `google_token` - Stores the Google access token
- `github_token` - Stores the GitHub access token
- `google_refresh_token` - Stores the Google refresh token
- `github_refresh_token` - Stores the GitHub refresh token

## Testing OAuth

### Test Google Login
1. Navigate to `http://ecommerce.local/login`
2. Click the "Google" button
3. Sign in with your Google account
4. You should be redirected to the dashboard

### Test GitHub Login
1. Navigate to `http://ecommerce.local/login`
2. Click the "GitHub" button
3. Authorize the application
4. You should be redirected to the dashboard

## Files Modified

### Controllers
- `app/Http/Controllers/Auth/SocialAuthController.php` - Handles OAuth callbacks

### Models
- `app/Models/User.php` - Updated with social auth fields

### Routes
- `routes/auth.php` - Added OAuth routes

### Views
- `resources/views/auth/login.blade.php` - Added social auth buttons
- `resources/views/auth/register.blade.php` - Added social auth buttons

### Configuration
- `config/services.php` - Added Google and GitHub configuration
- `.env` - Added OAuth environment variables

## Troubleshooting

### Invalid Redirect URI
If you get "Invalid redirect URI", make sure:
1. Your application is accessible at `http://ecommerce.local`
2. The redirect URI in your OAuth app settings matches exactly
3. You've updated the .env file with the correct URI

### User Already Exists
If a user tries to OAuth with an email that's already registered, the system will:
1. Link the OAuth account to the existing user
2. Log them in
3. No duplicate user will be created

### Missing Fields
If you get an "invalid callback" error:
1. Ensure the OAuth credentials are in your .env file
2. Run `php artisan config:cache` to clear cached config
3. Clear all caches with `php artisan optimize:clear`

## Production Considerations

Before deploying to production:

1. **Update Redirect URIs**: Change all `http://ecommerce.local` to your production domain
2. **Update .env**: Use production OAuth credentials
3. **Enable HTTPS**: OAuth requires HTTPS on production
4. **Store Tokens Securely**: Consider encrypting tokens in the database
5. **Email Verification**: Disable email verification requirement for OAuth users (optional)

## Additional Features

To add features like:
- Disconnect OAuth accounts
- Link multiple OAuth accounts
- Automatically verify email for OAuth users

Please extend the `SocialAuthController` class accordingly.
