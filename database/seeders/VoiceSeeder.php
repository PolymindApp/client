<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class VoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $voices = [
            [
               "language" => "Arabic",
//               "code" => "arb",
               "code" => "ar-SA",
               "name" => "Zeina",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Chinese, Mandarin",
               "code" => "zh-CN",
               "name" => "Zhiyu",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Danish",
               "code" => "da-DK",
               "name" => "Naja",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Danish",
               "code" => "da-DK",
               "name" => "Mads",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Dutch",
               "code" => "nl-NL",
               "name" => "Lotte",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Dutch",
               "code" => "nl-NL",
               "name" => "Ruben",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (Australian)",
               "code" => "en-AU",
               "name" => "Nicole",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (Australian)",
               "code" => "en-AU",
               "name" => "Olivia",
               "gender" => 1,
               "neural" => true,
               "standard" => false,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (Australian)",
               "code" => "en-AU",
               "name" => "Russell",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (British)",
               "code" => "en-GB",
               "name" => "Amy",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (British)",
               "code" => "en-GB",
               "name" => "Emma",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (British)",
               "code" => "en-GB",
               "name" => "Brian",
               "gender" => 0,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (Indian)",
               "code" => "en-IN",
               "name" => "Aditi",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => true,
               "child" => false,
            ],
            [
               "language" => "English (Indian)",
               "code" => "en-IN",
               "name" => "Raveena",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (New Zealand)",
               "code" => "en-NZ",
               "name" => "Aria",
               "gender" => 1,
               "neural" => true,
               "standard" => false,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (South African)",
               "code" => "en-ZA",
               "name" => "Ayanda",
               "gender" => 1,
               "neural" => true,
               "standard" => false,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Ivy",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => true,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Joanna",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Kendra",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Kimberly",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Salli",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Joey",
               "gender" => 0,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Justin",
               "gender" => 0,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => true,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Kevin",
               "gender" => 0,
               "neural" => true,
               "standard" => false,
               "bilingual" => false,
               "child" => true,
            ],
            [
               "language" => "English (US)",
               "code" => "en-US",
               "name" => "Matthew",
               "gender" => 0,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "English (Welsh)",
               "code" => "en-WL",
               "name" => "Geraint",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "French",
               "code" => "fr-FR",
               "name" => "Céline",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "French",
               "code" => "fr-FR",
               "name" => "Léa",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "French",
               "code" => "fr-FR",
               "name" => "Mathieu",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "French (Canadian)",
               "code" => "fr-CA",
               "name" => "Chantal",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "French (Canadian)",
               "code" => "fr-CA",
               "name" => "Gabrielle",
               "gender" => 1,
               "neural" => true,
               "standard" => false,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "German",
               "code" => "de-DE",
               "name" => "Marlene",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "German",
               "code" => "de-DE",
               "name" => "Vicki",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "German",
               "code" => "de-DE",
               "name" => "Hans",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Hindi",
               "code" => "hi-IN",
               "name" => "Aditi",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => true,
               "child" => false,
            ],
            [
               "language" => "Icelandic",
               "code" => "is-IS",
               "name" => "Dóra",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Icelandic",
               "code" => "is-IS",
               "name" => "Karl",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Italian",
               "code" => "it-IT",
               "name" => "Carla",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Italian",
               "code" => "it-IT",
               "name" => "Bianca",
               "gender" => true,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Italian",
               "code" => "it-IT",
               "name" => "Giorgio",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Japanese",
               "code" => "ja-JP",
               "name" => "Mizuki",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Japanese",
               "code" => "ja-JP",
               "name" => "Takumi",
               "gender" => 0,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Korean",
               "code" => "ko-KR",
               "name" => "Seoyeon",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Norwegian",
               "code" => "nb-NO",
               "name" => "Liv",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Polish",
               "code" => "pl-PL",
               "name" => "Ewa",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Polish",
               "code" => "pl-PL",
               "name" => "Maja",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Polish",
               "code" => "pl-PL",
               "name" => "Jacek",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Polish",
               "code" => "pl-PL",
               "name" => "Jan",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Portuguese (European)",
               "code" => "pt-PT",
               "name" => "Inês",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Portuguese (European)",
               "code" => "pt-PT",
               "name" => "Cristiano",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
                "language" => "Portuguese (Brazilian)",
                "code" => "pt-BR",
                "name" => "Camila",
                "gender" => 1,
                "neural" => true,
                "standard" => true,
                "bilingual" => false,
                "child" => false,
            ],
            [
                "language" => "Portuguese (Brazilian)",
                "code" => "pt-BR",
                "name" => "Vitória",
                "gender" => 1,
                "neural" => false,
                "standard" => true,
                "bilingual" => false,
                "child" => false,
            ],
            [
                "language" => "Portuguese (Brazilian)",
                "code" => "pt-BR",
                "name" => "Ricardo",
                "gender" => 0,
                "neural" => false,
                "standard" => true,
                "bilingual" => false,
                "child" => false,
            ],
            [
               "language" => "Romanian",
               "code" => "ro-RO",
               "name" => "Carmen",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Russian",
               "code" => "ru-RU",
               "name" => "Tatyana",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Russian",
               "code" => "ru-RU",
               "name" => "Maxim",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Spanish (European)",
               "code" => "es-ES",
               "name" => "Conchita",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Spanish (European)",
               "code" => "es-ES",
               "name" => "Lucia",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Spanish (European)",
               "code" => "es-ES",
               "name" => "Enrique",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Spanish (Mexican)",
               "code" => "es-MX",
               "name" => "Mia",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Spanish (US)",
               "code" => "es-US",
               "name" => "Lupe",
               "gender" => 1,
               "neural" => true,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Spanish (US)",
               "code" => "es-US",
               "name" => "Penélope",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Spanish (US)",
               "code" => "es-US",
               "name" => "Miguel",
               "gender" => 0,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Swedish",
               "code" => "sv-SE",
               "name" => "Astrid",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Turkish",
               "code" => "tr-TR",
               "name" => "Filiz",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ],
            [
               "language" => "Welsh",
               "code" => "cy-GB",
               "name" => "Gwyneth",
               "gender" => 1,
               "neural" => false,
               "standard" => true,
               "bilingual" => false,
               "child" => false,
            ]
        ];

        foreach($voices as $voice) {
            $item = $voice;
            unset($item['language']);
            $language = DB::table('languages')->where(['code' => $item['code']])->first();
            if ($language) {
                $item['language_id'] = $language->id;
            }
            unset($item['code']);
            $item['created_at'] = now();
            DB::table('voices')->insert($item);
        }
    }
}
