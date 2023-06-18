<?php

namespace App\Handlers;

use App\Models\Log;
use Throwable;
use Monolog\Handler\AbstractProcessingHandler;

class DatabaseHandler extends AbstractProcessingHandler
{
    protected function write($record): void
    {
        $record = is_array($record) ? $record : $record->toArray();

        $exception = $record['context']['exception'] ?? null;

        if ($exception instanceof Throwable) {
            $record['context']['exception'] = (string) $exception;
        }

        Log::create([
            'version' => 1,
            'type' => $record['message'],
            'meta' => empty($record['context'])
                ? null
                : $record['context']
        ]);
    }
}
