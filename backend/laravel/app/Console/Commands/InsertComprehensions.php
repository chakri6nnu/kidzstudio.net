<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ComprehensionPassage;

class InsertComprehensions extends Command
{
    protected $signature = 'comprehensions:insert {count=50}';
    protected $description = 'Insert N comprehension passages (default 50)';

    public function handle(): int
    {
        $count = (int) $this->argument('count');
        $topics = ['Nature', 'History', 'Science', 'Technology', 'Literature'];
        $created = 0;
        for ($i = 1; $i <= $count; $i++) {
            $title = $topics[($i - 1) % count($topics)] . ' Passage #' . $i;
            $body = 'This is an auto-generated comprehension passage number ' . $i . '. ' .
                'It is intended for reading practice and question attachments.';
            ComprehensionPassage::create([
                'title' => $title,
                'body' => $body,
                'is_active' => 1,
            ]);
            $created++;
        }
        $this->info("Inserted {$created} comprehension passages.");
        return Command::SUCCESS;
    }
}



