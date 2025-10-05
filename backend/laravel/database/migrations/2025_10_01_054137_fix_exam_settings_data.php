<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class FixExamSettingsData extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Fix invalid settings data in exams table
        DB::table('exams')
            ->whereNotNull('settings')
            ->where('settings', '!=', '')
            ->whereRaw('JSON_VALID(settings) = 0')
            ->update(['settings' => null]);

        // Also fix any settings that are empty strings
        DB::table('exams')
            ->where('settings', '')
            ->update(['settings' => null]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // No need to reverse this fix
    }
}