<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Settings\BillingSettings;
use App\Settings\TaxSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BillingTaxController extends Controller
{
    public function __construct()
    {
        $this->middleware(['role:admin']);
    }

    /**
     * Get billing and tax settings
     *
     * @param BillingSettings $billingSettings
     * @param TaxSettings $taxSettings
     * @return JsonResponse
     */
    public function index(BillingSettings $billingSettings, TaxSettings $taxSettings): JsonResponse
    {
        return response()->json([
            'billing' => $billingSettings->toArray(),
            'tax' => $taxSettings->toArray(),
            'countries' => isoCountries()
        ]);
    }

    /**
     * Update billing settings
     *
     * @param Request $request
     * @param BillingSettings $settings
     * @return JsonResponse
     */
    public function updateBilling(Request $request, BillingSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'vendor_name' => ['required', 'max:255'],
            'address' => ['required', 'max:1000'],
            'city' => ['required', 'max:100'],
            'state' => ['required', 'max:100'],
            'country' => ['required', 'max:100'],
            'zip' => ['required', 'max:20'],
            'phone_number' => ['required', 'max:20'],
            'vat_number' => ['nullable', 'max:50'],
            'enable_invoicing' => ['required', 'boolean'],
            'invoice_prefix' => ['required', 'max:10'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->vendor_name = $request->vendor_name;
            $settings->address = $request->address;
            $settings->city = $request->city;
            $settings->state = $request->state;
            $settings->country = $request->country;
            $settings->zip = $request->zip;
            $settings->phone_number = $request->phone_number;
            $settings->vat_number = $request->vat_number ?? '';
            $settings->enable_invoicing = $request->boolean('enable_invoicing');
            $settings->invoice_prefix = $request->invoice_prefix;
            $settings->save();

            return response()->json([
                'message' => 'Billing settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update billing settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update tax settings
     *
     * @param Request $request
     * @param TaxSettings $settings
     * @return JsonResponse
     */
    public function updateTax(Request $request, TaxSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'enable_tax' => ['required', 'boolean'],
            'tax_name' => ['required', 'max:100'],
            'tax_type' => ['required', 'in:inclusive,exclusive'],
            'tax_amount_type' => ['required', 'in:percentage,fixed'],
            'tax_amount' => ['required', 'numeric', 'min:0'],
            'enable_additional_tax' => ['required', 'boolean'],
            'additional_tax_name' => ['nullable', 'max:100'],
            'additional_tax_type' => ['nullable', 'in:inclusive,exclusive'],
            'additional_tax_amount_type' => ['nullable', 'in:percentage,fixed'],
            'additional_tax_amount' => ['nullable', 'numeric', 'min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->enable_tax = $request->boolean('enable_tax');
            $settings->tax_name = $request->tax_name;
            $settings->tax_type = $request->tax_type;
            $settings->tax_amount_type = $request->tax_amount_type;
            $settings->tax_amount = $request->tax_amount;
            $settings->enable_additional_tax = $request->boolean('enable_additional_tax');
            $settings->additional_tax_name = $request->additional_tax_name ?? '';
            $settings->additional_tax_type = $request->additional_tax_type ?? 'exclusive';
            $settings->additional_tax_amount_type = $request->additional_tax_amount_type ?? 'fixed';
            $settings->additional_tax_amount = $request->additional_tax_amount ?? 0;
            $settings->save();

            return response()->json([
                'message' => 'Tax settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update tax settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
}
