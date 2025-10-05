<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        \App\Console\Commands\InsertQuizzes::class,
        \App\Console\Commands\InsertPracticeSets::class,
        \App\Console\Commands\InsertLessons::class,
        \App\Console\Commands\InsertVideos::class,
        \App\Console\Commands\InsertComprehensions::class,
        \App\Console\Commands\InsertComprehensionQuestions::class,
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
         $schedule->command('expire:schedules')->everySixHours();
         $schedule->command('expire:subscriptions')->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
