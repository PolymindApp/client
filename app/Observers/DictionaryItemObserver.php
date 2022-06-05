<?php

namespace App\Observers;

use App\Models\Dictionary;
use App\Models\DictionaryItem;

class DictionaryItemObserver
{
    private function updateTotalItems(string $dictionaryId)
    {
        if ($dictionaryId) {
            $dictionary = Dictionary::find($dictionaryId);
            if ($dictionary) {
                $dictionary->total_items = DictionaryItem::where('dictionary_id', '=', $dictionaryId)->count();
                $dictionary->save();
            }
        }
    }

    public function created(DictionaryItem $model)
    {
        if ($model['dictionary_id']) {
            $this->updateTotalItems($model['dictionary_id']);
        }
    }

    public function deleted(DictionaryItem $model)
    {
        if ($model['dictionary_id']) {
            $this->updateTotalItems($model['dictionary_id']);
        }
    }
}
