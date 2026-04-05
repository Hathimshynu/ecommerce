<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->with(['prompt' => 'consent'])
            ->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            return $this->findOrCreateUser(
                'google',
                $googleUser,
                'google_id'
            );
        } catch (\Exception $e) {
            return redirect()->route('login')
                ->with('error', 'Failed to authenticate with Google');
        }
    }

    /**
     * Redirect to GitHub OAuth
     */
    public function redirectToGithub()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Handle GitHub OAuth callback
     */
    public function handleGithubCallback()
    {
        try {
            $githubUser = Socialite::driver('github')->user();

            return $this->findOrCreateUser(
                'github',
                $githubUser,
                'github_id'
            );
        } catch (\Exception $e) {
            return redirect()->route('login')
                ->with('error', 'Failed to authenticate with GitHub');
        }
    }

    /**
     * Find or create user from OAuth provider
     */
    private function findOrCreateUser($provider, $providerUser, $providerIdKey)
    {
        // Check if user exists by provider ID
        $user = User::where($providerIdKey, $providerUser->getId())->first();

        if ($user) {
            // Update tokens
            $this->updateTokens($user, $provider, $providerUser);
            Auth::login($user, remember: true);
            return redirect()->intended(route('home'));
        }

        // Check if user exists by email
        $userByEmail = User::where('email', $providerUser->getEmail())->first();

        if ($userByEmail) {
            // Link the social account to existing user
            $userByEmail->update([
                $providerIdKey => $providerUser->getId(),
                $provider . '_token' => $providerUser->token,
                $provider . '_refresh_token' => $providerUser->refreshToken ?? null,
            ]);
            Auth::login($userByEmail, remember: true);
            return redirect()->intended(route('home'));
        }

        // Create new user
        $user = User::create([
            'name' => $providerUser->getName() ?? $providerUser->getNickname(),
            'email' => $providerUser->getEmail(),
            $providerIdKey => $providerUser->getId(),
            $provider . '_token' => $providerUser->token,
            $provider . '_refresh_token' => $providerUser->refreshToken ?? null,
        ]);

        Auth::login($user, remember: true);
        return redirect()->intended(route('home'));
    }

    /**
     * Update OAuth tokens for existing user
     */
    private function updateTokens($user, $provider, $providerUser)
    {
        $user->update([
            $provider . '_token' => $providerUser->token,
            $provider . '_refresh_token' => $providerUser->refreshToken ?? null,
        ]);
    }
}
