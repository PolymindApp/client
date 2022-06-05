<?php

namespace App\Observers;

use App\Models\DictionaryCategory;
use App\Models\Dictionary;

class DictionaryObserver
{
    private function updateTotalItems(string $categoryId)
    {
        if ($categoryId) {
            $category = DictionaryCategory::find($categoryId);
            if ($category) {
                $category->total_dictionaries = Dictionary::where('dictionary_category_id', '=', $categoryId)->count();
                $category->save();
            }
        }
    }

    public function created(Dictionary $model)
    {
        if ($model['dictionary_category_id']) {
            $this->updateTotalItems($model['dictionary_category_id']);
        }
    }

    public function deleted(Dictionary $model)
    {
        if ($model['dictionary_category_id']) {
            $this->updateTotalItems($model['dictionary_category_id']);
        }
    }
}
