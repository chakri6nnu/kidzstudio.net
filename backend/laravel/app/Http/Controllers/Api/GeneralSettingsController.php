<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Settings\SiteSettings;
use App\Settings\LocalizationSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Jackiedo\DotenvEditor\Facades\DotenvEditor;

class GeneralSettingsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['role:admin']);
    }

    /**
     * Get general settings (site and localization)
     */
    public function index(
        SiteSettings $siteSettings,
        LocalizationSettings $localizationSettings
    ): JsonResponse {
        $timeZones = \DateTimeZone::listIdentifiers(\DateTimeZone::ALL);
        
        return response()->json([
            'site' => $siteSettings->toArray(),
            'localization' => $localizationSettings->toArray(),
            'timezones' => $timeZones,
            'languages' => isoLocaleIdentifiers()
        ]);
    }

    /**
     * Update site settings
     */
    public function updateSite(Request $request, SiteSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'app_name' => ['required', 'string', 'max:255'],
            'tag_line' => ['required', 'string', 'max:255'],
            'seo_description' => ['required', 'string', 'max:255'],
            'can_register' => ['required', 'boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->app_name = $request->app_name;
            $settings->tag_line = $request->tag_line;
            $settings->seo_description = $request->seo_description;
            $settings->can_register = $request->boolean('can_register');
            $settings->save();

            // Update .env file
            $env = DotenvEditor::load();
            $env->setKey('APP_NAME', $request->app_name);
            $env->save();

            return response()->json([
                'message' => 'Site settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update site settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update site logo
     */
    public function updateLogo(Request $request): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'logo' => ['required', 'image', 'mimes:jpg,png', 'max:512'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $path = $request->file('logo')->store('logos', 'public');
            
            $settings = app(SiteSettings::class);
            $settings->logo_path = $path;
            $settings->save();

            return response()->json([
                'message' => 'Logo updated successfully.',
                'success' => true,
                'data' => ['logo_path' => $path]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update logo: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update white logo
     */
    public function updateWhiteLogo(Request $request): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'white_logo' => ['required', 'image', 'mimes:jpg,png', 'max:512'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $path = $request->file('white_logo')->store('logos', 'public');
            
            $settings = app(SiteSettings::class);
            $settings->white_logo_path = $path;
            $settings->save();

            return response()->json([
                'message' => 'White logo updated successfully.',
                'success' => true,
                'data' => ['white_logo_path' => $path]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update white logo: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update favicon
     */
    public function updateFavicon(Request $request): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'favicon' => ['required', 'image', 'mimes:png', 'max:512'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $path = $request->file('favicon')->store('favicons', 'public');
            
            $settings = app(SiteSettings::class);
            $settings->favicon_path = $path;
            $settings->save();

            return response()->json([
                'message' => 'Favicon updated successfully.',
                'success' => true,
                'data' => ['favicon_path' => $path]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update favicon: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Update localization settings
     */
    public function updateLocalization(Request $request, LocalizationSettings $settings): JsonResponse
    {
        if (config('qwiktest.demo_mode')) {
            return response()->json([
                'message' => 'Demo Mode! These settings can\'t be changed.',
                'success' => false
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'default_locale' => ['required', 'string', 'max:255'],
            'default_direction' => ['required', 'in:ltr,rtl'],
            'default_timezone' => ['required', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false
            ], 422);
        }

        try {
            $settings->default_locale = $request->default_locale;
            $settings->default_direction = $request->default_direction;
            $settings->default_timezone = $request->default_timezone;
            $settings->save();

            // Update .env file
            $env = DotenvEditor::load();
            $env->setKey('APP_LOCALE', $request->default_locale);
            $env->save();

            return response()->json([
                'message' => 'Localization settings updated successfully.',
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update localization settings: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
}
