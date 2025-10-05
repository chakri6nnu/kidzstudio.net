<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Settings\EmailSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class EmailController extends Controller
{
    public function __construct()
    {
        $this->middleware(['role:admin']);
    }

    /**
     * Get email settings
     */
    public function index(EmailSettings $emailSettings): JsonResponse
    {
        return response()->json([
            'email' => $emailSettings->toArray(),
            'encryption_options' => $this->getEncryptionOptions(),
            'port_options' => $this->getPortOptions()
        ]);
    }

    /**
     * Update email settings
     */
    public function update(Request $request, EmailSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'host' => ['required', 'string', 'max:255'],
            'port' => ['required', 'integer', 'min:1', 'max:65535'],
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
            'encryption' => ['required', 'in:tls,ssl,none'],
            'from_address' => ['required', 'email', 'max:255'],
            'from_name' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->host = $request->host;
            $settings->port = $request->port;
            $settings->username = $request->username;
            $settings->password = $request->password;
            $settings->encryption = $request->encryption;
            $settings->from_address = $request->from_address;
            $settings->from_name = $request->from_name;
            $settings->save();

            // Update Laravel mail configuration
            $this->updateMailConfig($settings);

            return response()->json([
                'message' => 'Email settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update email settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Test email configuration
     */
    public function test(Request $request): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'test_email' => ['required', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            // Get current email settings
            $emailSettings = app(EmailSettings::class);
            
            // Update mail configuration temporarily
            $this->updateMailConfig($emailSettings);

            // Send test email
            Mail::raw('This is a test email from your application. If you receive this, your email configuration is working correctly!', function ($message) use ($request, $emailSettings) {
                $message->to($request->test_email)
                        ->subject('Test Email - ' . config('app.name'))
                        ->from($emailSettings->from_address, $emailSettings->from_name);
            });

            return response()->json([
                'message' => 'Test email sent successfully to ' . $request->test_email,
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send test email: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update Laravel mail configuration
     */
    private function updateMailConfig(EmailSettings $settings): void
    {
        Config::set('mail.mailers.smtp.host', $settings->host);
        Config::set('mail.mailers.smtp.port', $settings->port);
        Config::set('mail.mailers.smtp.username', $settings->username);
        Config::set('mail.mailers.smtp.password', $settings->password);
        Config::set('mail.mailers.smtp.encryption', $settings->encryption === 'none' ? null : $settings->encryption);
        Config::set('mail.from.address', $settings->from_address);
        Config::set('mail.from.name', $settings->from_name);
    }

    /**
     * Get available encryption options
     */
    private function getEncryptionOptions(): array
    {
        return [
            ['value' => 'tls', 'label' => 'TLS (Recommended)'],
            ['value' => 'ssl', 'label' => 'SSL'],
            ['value' => 'none', 'label' => 'None (Not Recommended)'],
        ];
    }

    /**
     * Get common port options
     */
    private function getPortOptions(): array
    {
        return [
            ['value' => 25, 'label' => '25 (SMTP)'],
            ['value' => 587, 'label' => '587 (TLS)'],
            ['value' => 465, 'label' => '465 (SSL)'],
            ['value' => 2525, 'label' => '2525 (Alternative)'],
        ];
    }
}
