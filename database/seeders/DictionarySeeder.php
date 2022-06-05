<?php

namespace Database\Seeders;

use App\Models\Language;
use App\Models\Dictionary;
use App\Models\DictionaryI18n;
use App\Models\DictionaryCategory;
use App\Models\DictionaryCategoryI18n;
use App\Models\DictionaryItem;
use App\Models\DictionaryItemI18n;
use App\Models\User;
use Illuminate\Database\Seeder;

class DictionarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::all()->random();
        $languages = Language::all();

        // Create categories
        DictionaryCategory::factory()->count(20)->create([
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ])->each(function ($category) use ($languages, $user) {
            foreach($languages as $language) {
                DictionaryCategoryI18n::factory()->create([
                    'dictionary_category_id' => $category->id,
                    'language_id' => $language->id,
                    'created_by' => $user->id,
                    'updated_by' => $user->id,
                ]);
            }
        });

        // Create dictionaries
        Dictionary::factory()->count(50)->create([
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ])->each(function ($dictionary) use ($languages, $user) {

            $arrLanguages = $languages->toArray();
            $randomLanguages = array_map(function ($key) use ($arrLanguages) {
                return (object) $arrLanguages[$key];
            }, array_rand($arrLanguages, rand(2, $languages->count())));

            foreach($randomLanguages as $language) {
                foreach(['title', 'body'] as $type) {
                    DictionaryI18n::factory()->create([
                        'type' => $type,
                        'dictionary_id' => $dictionary->id,
                        'language_id' => $language->id,
                        'created_by' => $user->id,
                        'updated_by' => $user->id,
                    ]);
                }
            }

            DictionaryItem::factory(rand(25, 75))->create([
                'dictionary_id' => $dictionary->id,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ])->each(function ($item) use ($languages, $user, $randomLanguages, $dictionary) {
                foreach($randomLanguages as $language) {
                    DictionaryItemI18n::factory()->create([
                        'dictionary_item_id' => $item->id,
                        'language_id' => $language->id,
                        'created_by' => $user->id,
                        'updated_by' => $user->id,
                    ]);
                }
            });
        });
    }
}
