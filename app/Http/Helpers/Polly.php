<?php

namespace App\Http\Helpers;

use Aws\Polly\PollyClient;
use Illuminate\Support\Str;

class Polly
{
    private $client;

    public function __construct()
    {
        $this->client = new PollyClient([
            'region' => env('AWS_DEFAULT_REGION'),
            'version' => env('AWS_API_VERSION')
        ]);
    }

    /**
     * Get synthetic voice stream of data on the fly
     *
     * @param $item
     * @return \Aws\Result
     */
    public function getDataStream($text, $locale, $voiceId, $standard = true)
    {
        $result = $this->client->synthesizeSpeech([
            'Engine' => $standard ? 'standard' : 'neural',
            'LanguageCode' => $locale,
            'OutputFormat' => 'mp3',
            'Text' => '<speak>' . $text . '</speak>',
            'TextType' => 'ssml',
            'VoiceId' => Str::ascii($voiceId),
        ]);

        return $result->get('AudioStream')->getContents();
    }
}
