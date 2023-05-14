<?php

namespace App\Http\Controllers;

use App\Models\Dictionary;
use App\Models\DictionaryI18n;
use App\Models\DictionaryItem;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class AdminDictionaryController extends BaseAdminController
{
    protected $model = Dictionary::class;

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $this->validateRequest($request);

        $fields = $request->all();

        $model = Dictionary::create($fields);
        foreach($fields['i18n'] as $i18n) {
            if (!$i18n['id']) {
                $i18n['dictionary_id'] = $model->id;
                $i18n['language_id'] = $i18n['language']['id'];
                DictionaryI18n::create($i18n);
            }
        }

        $model = Dictionary::find($model->id);
        return response($model, 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  string  $id
     * @return Response
     */
    public function update(Request $request, string $id): Response
    {
        $this->validateRequest($request);

        $fields = $request->all();

        $model = Dictionary::find($id);
        foreach($fields['i18n'] as $i18n) {
            if ($i18n['id']) {
                $i18n['dictionary_id'] = $id;
                $i18n['language_id'] = $i18n['language']['id'];
                $i18nModel = DictionaryI18n::find($i18n['id']);
                $i18nModel->update($i18n);
            }
        }

        unset($fields['id']);
        $model->update($fields);

        return response($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $id
     * @return Response
     */
    public function destroy(string $id): Response
    {
        $dictionary = Dictionary::find($id);
        foreach($dictionary->i18n as $i18n) {
            DictionaryI18n::destroy($i18n->id);
        }
        if ($dictionary->cover) {
            Media::destroy($dictionary->cover->id);
        }

        $results = DictionaryItem::where('dictionary_id', '=', $id)->get();
        foreach($results as $item) {
            DictionaryItem::destroy($item->id);
        }

        return response(Dictionary::destroy($id));
    }

    protected function validateItem($fields)
    {
        return Validator::make($fields, [
            'dictionary_category_id' => 'required',
            'media_id' => 'required',
            'i18n' => 'required|array',
        ])->validate();
    }
}
