<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\VerifyEmail;
use App\Notifications\RequestPasswordReset;
use App\Notifications\WelcomeNewUser;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

class AuthController extends Controller
{
    public function isLoggedIn(): Response
    {
        $user = auth()->user();
        return response($user === null ? false : $user, !$user ? 401 : 200);
    }

    public function register(Request $request): Response
    {
        $fields = $request->validate([
            'email' => 'required|email:rfc,dns|unique:users,email',
            'password' => 'required|string|confirmed',
        ]);

        $fields['password'] = bcrypt($fields['password']);

        $user = User::create($fields);
        $token = $user->createToken(env('APP_KEY'))->plainTextToken;
        $user->notify(new VerifyEmail());

        return response([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function verifyEmail(Request $request): Response
    {
        $request->validate([
            'signature' => 'required|string',
        ]);

        $decrypt = json_decode(Crypt::decryptString((string) $request->query('signature')));

        if (Carbon::now()->gte($decrypt->expiration)) {
            return response(['message' => 'EXPIRED'], 400);
        }

        $user = User::where(['email' => $decrypt->email])->first();
        if ($user->hasVerifiedEmail()) {
            return response(['message' => 'ALREADY_VERIFIED'], 400);
        }

        $user->markEmailAsVerified();
        $user->notify(new WelcomeNewUser());
        $token = $user->createToken(env('APP_KEY'))->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function resendVerificationEmail(Request $request): Response
    {
        $fields = $request->validate([
            'email' => 'required|email:rfc,dns',
        ]);

        $user = User::where(['email' => $fields['email']])->first();
        if ($user->hasVerifiedEmail()) {
            return response(['message' => 'ALREADY_VERIFIED'], 400);
        }

        $user->notify(new VerifyEmail());

        return response($user);
    }

    public function logout(Request $request): Response
    {
        auth()->user()->tokens()->delete();
        return response(1, 200);
    }

    public function login(Request $request): Response
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        if (!auth()->attempt($fields)) {
            return response(['message' => 'BAD_CREDENTIALS', 'errors' => [
                'email' => __('errors.input.badCredentials'),
                'password' => __('errors.input.badCredentials'),
            ]], 401);
        }

        $user = User::where(['email' => $fields['email']])->first();
        if (!$user->hasVerifiedEmail()) {
            return response(['message' => 'EMAIL_NOT_VERIFIED'], 403);
        }

        $token = $user->createToken(env('APP_KEY'))->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function requestPasswordReset(Request $request): Response
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $status = Password::sendResetLink(
            $request->only('email'),
            function($user, $token) {
                $user->notify(new RequestPasswordReset($token));
            }
        );

        return response([
            'message' => $status,
        ], 201);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $credentials = $request->only('email', 'password', 'password_confirmation', 'token');

        $status = Password::reset($credentials, function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        });

        return response([
            'message' => strtoupper(str_replace('.', '_', $status))
        ], $status === Password::PASSWORD_RESET ? 201 : 400);
    }
}
