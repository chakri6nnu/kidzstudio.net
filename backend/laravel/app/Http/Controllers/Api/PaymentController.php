<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Settings\PaymentSettings;
use App\Settings\StripeSettings;
use App\Settings\RazorpaySettings;
use App\Settings\PayPalSettings;
use App\Settings\BankSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['role:admin']);
    }

    /**
     * Get all payment settings
     */
    public function index(
        PaymentSettings $paymentSettings,
        StripeSettings $stripeSettings,
        RazorpaySettings $razorpaySettings,
        PayPalSettings $paypalSettings,
        BankSettings $bankSettings
    ): JsonResponse {
        return response()->json([
            'payment' => $paymentSettings->toArray(),
            'stripe' => $stripeSettings->toArray(),
            'razorpay' => $razorpaySettings->toArray(),
            'paypal' => $paypalSettings->toArray(),
            'bank' => $bankSettings->toArray(),
            'currencies' => $this->getCurrencies(),
            'payment_processors' => $this->getPaymentProcessors()
        ]);
    }

    /**
     * Update general payment settings
     */
    public function updatePayment(Request $request, PaymentSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'default_payment_processor' => ['required', 'in:stripe,razorpay,paypal,bank'],
            'default_currency' => ['required', 'string', 'max:3'],
            'currency_symbol' => ['required', 'string', 'max:10'],
            'currency_symbol_position' => ['required', 'in:before,after'],
            'enable_bank' => ['required', 'boolean'],
            'enable_paypal' => ['required', 'boolean'],
            'enable_stripe' => ['required', 'boolean'],
            'enable_razorpay' => ['required', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->default_payment_processor = $request->default_payment_processor;
            $settings->default_currency = $request->default_currency;
            $settings->currency_symbol = $request->currency_symbol;
            $settings->currency_symbol_position = $request->currency_symbol_position;
            $settings->enable_bank = $request->boolean('enable_bank');
            $settings->enable_paypal = $request->boolean('enable_paypal');
            $settings->enable_stripe = $request->boolean('enable_stripe');
            $settings->enable_razorpay = $request->boolean('enable_razorpay');
            $settings->save();

            return response()->json([
                'message' => 'Payment settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update payment settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update Stripe settings
     */
    public function updateStripe(Request $request, StripeSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'api_key' => ['required', 'string', 'max:255'],
            'secret_key' => ['required', 'string', 'max:255'],
            'webhook_url' => ['nullable', 'url', 'max:255'],
            'webhook_secret' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->api_key = $request->api_key;
            $settings->secret_key = $request->secret_key;
            $settings->webhook_url = $request->webhook_url ?? '';
            $settings->webhook_secret = $request->webhook_secret ?? '';
            $settings->save();

            return response()->json([
                'message' => 'Stripe settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update Stripe settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update Razorpay settings
     */
    public function updateRazorpay(Request $request, RazorpaySettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'key_id' => ['required', 'string', 'max:255'],
            'key_secret' => ['required', 'string', 'max:255'],
            'webhook_url' => ['nullable', 'url', 'max:255'],
            'webhook_secret' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->key_id = $request->key_id;
            $settings->key_secret = $request->key_secret;
            $settings->webhook_url = $request->webhook_url ?? '';
            $settings->webhook_secret = $request->webhook_secret ?? '';
            $settings->save();

            return response()->json([
                'message' => 'Razorpay settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update Razorpay settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update PayPal settings
     */
    public function updatePayPal(Request $request, PayPalSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'client_id' => ['required', 'string', 'max:255'],
            'secret' => ['required', 'string', 'max:255'],
            'webhook_url' => ['nullable', 'url', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->client_id = $request->client_id;
            $settings->secret = $request->secret;
            $settings->webhook_url = $request->webhook_url ?? '';
            $settings->save();

            return response()->json([
                'message' => 'PayPal settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update PayPal settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update Bank settings
     */
    public function updateBank(Request $request, BankSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'bank_name' => ['required', 'string', 'max:255'],
            'account_owner' => ['required', 'string', 'max:255'],
            'account_number' => ['required', 'string', 'max:255'],
            'iban' => ['nullable', 'string', 'max:255'],
            'routing_number' => ['nullable', 'string', 'max:255'],
            'bic_swift' => ['nullable', 'string', 'max:255'],
            'other_details' => ['nullable', 'string', 'max:1000'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->bank_name = $request->bank_name;
            $settings->account_owner = $request->account_owner;
            $settings->account_number = $request->account_number;
            $settings->iban = $request->iban ?? '';
            $settings->routing_number = $request->routing_number ?? '';
            $settings->bic_swift = $request->bic_swift ?? '';
            $settings->other_details = $request->other_details ?? '';
            $settings->save();

            return response()->json([
                'message' => 'Bank settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update Bank settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Get available currencies
     */
    private function getCurrencies(): array
    {
        return [
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$'],
            ['code' => 'EUR', 'name' => 'Euro', 'symbol' => '€'],
            ['code' => 'GBP', 'name' => 'British Pound', 'symbol' => '£'],
            ['code' => 'INR', 'name' => 'Indian Rupee', 'symbol' => '₹'],
            ['code' => 'CAD', 'name' => 'Canadian Dollar', 'symbol' => 'C$'],
            ['code' => 'AUD', 'name' => 'Australian Dollar', 'symbol' => 'A$'],
            ['code' => 'JPY', 'name' => 'Japanese Yen', 'symbol' => '¥'],
            ['code' => 'CNY', 'name' => 'Chinese Yuan', 'symbol' => '¥'],
        ];
    }

    /**
     * Get available payment processors
     */
    private function getPaymentProcessors(): array
    {
        return [
            ['value' => 'stripe', 'label' => 'Stripe'],
            ['value' => 'razorpay', 'label' => 'Razorpay'],
            ['value' => 'paypal', 'label' => 'PayPal'],
            ['value' => 'bank', 'label' => 'Bank Transfer'],
        ];
    }
}
