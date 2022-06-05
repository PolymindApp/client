<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $languages = [
            ['Arabic, Modern Standard', 'ar-SA'],
            ['Chinese, Simplified', 'zh-CN'],
            ['Danish', 'da-DK'],
            ['Dutch', 'nl-NL'],
            ['English, Australian', 'en-AU'],
            ['English, British', 'en-GB'],
            ['English, Indian', 'en-IN'],
            ['English, New Zealand', 'en-NZ'],
            ['English, South African', 'en-ZA'],
            ['English, US', 'en-US'],
            ['English, Welsh', 'en-WL'],
            ['French', 'fr-FR'],
            ['French, Canadian', 'fr-CA'],
            ['German', 'de-DE'],
            ['Hindi, Indian', 'hi-IN'],
            ['Icelandic', 'is-IS'],
            ['Italian', 'it-IT'],
            ['Japanese', 'ja-JP'],
            ['Korean', 'ko-KR'],
            ['Norwegian', 'nb-NO'],
            ['Polish', 'pl-PL'],
            ['Portuguese', 'pt-PT'],
            ['Portuguese, Brazilian', 'pt-BR'],
            ['Romanian', 'ro-RO'],
            ['Russian', 'ru-RU'],
            ['Spanish, European', 'es-ES'],
            ['Spanish, Mexican', 'es-MX'],
            ['Spanish, US', 'es-US'],
            ['Swedish', 'sv-SE'],
            ['Turkish', 'tr-TR'],
            ['Welsh', 'cy-GB'],
        ];

        foreach($languages as $language) {
            DB::table('languages')->insert([
                'name' => $language[0],
                'code' => $language[1],
                'created_at' => now(),
            ]);
        }
    }
}
