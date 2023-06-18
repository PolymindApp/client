<?php

namespace App\Http\Controllers;

use App\Models\Dictionary;
use App\Models\DictionaryI18n;
use App\Models\DictionaryItem;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdminDictionaryController extends BaseCrudController
{
    protected $model = Dictionary::class;

    /**
     * Create or update a list of resources in storage.
     *
     * @param Request $request
     * @return Response
     * @throws ValidationException
     */
    public function bulkStore(Request $request): Response
    {
        $results = [];
        $items = $request->all();

        foreach($items as $item) {
            $this->validateItem($item);
        }
        foreach($items as $item) {

            if ($item['cover']['id']) {
                $item['media_id'] = $item['cover']['id'];
            } else if ($item['cover']['url']) {
                $newMedia = Media::create($item['cover']);
                $item['media_id'] = $newMedia['id'];
            }

            if ($item['id'] === null) {
                $newItem = Dictionary::create($item);
                foreach($item['i18n'] as $i18n) {
                    if (!$i18n['id']) {
                        $i18n['dictionary_id'] = $newItem->id;
                        $i18n['language_id'] = $i18n['language']['id'];
                        DictionaryI18n::create($i18n);
                    }
                }
                $newItem = Dictionary::find($newItem->id);
            } else {
                $newItem = Dictionary::find($item['id']);
                foreach($item['i18n'] as $i18n) {
                    if ($i18n['id']) {
                        $i18n['dictionary_id'] = $item['id'];
                        $i18n['language_id'] = $i18n['language']['id'];
                        $i18nModel = DictionaryI18n::find($i18n['id']);
                        $i18nModel->update($i18n);
                    }
                }
                unset($item['id']);
                $newItem->update($item);
            }
            $results[] = $newItem;
        }

        return response($results, 201);
    }

    /**
     * Remove a list of resources from storage.
     *
     * @param  Request $request
     * @return Response
     */
    public function bulkDestroy(Request $request): Response
    {
        foreach($request->all() as $id) {

            $dictionary = Dictionary::find($id);
            foreach($dictionary->i18n as $i18n) {
                $results[] = DictionaryI18n::destroy($i18n->id);
            }
            if ($dictionary->cover) {
                Media::destroy($dictionary->cover->id);
            }

            $results = DictionaryItem::where('dictionary_id', '=', $id)->get();
            foreach($results as $item) {
                DictionaryItem::destroy($item->id);
            }
        }

        $results = parent::bulkDestroy($request);
        return response($results);
    }

    protected function validateItem($fields): array
    {
        return Validator::make($fields, [
            'dictionary_category_id' => 'required',
            'i18n' => 'required|array',
        ])->validate();
    }
}
