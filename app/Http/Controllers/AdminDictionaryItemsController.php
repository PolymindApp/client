<?php

namespace App\Http\Controllers;

use App\Models\DictionaryItem;
use App\Models\DictionaryItemI18n;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class AdminDictionaryItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(string $uuid): Response
    {
        return response(DictionaryItem::where(['dictionary_id', '=', $uuid])->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(string $uuid, Request $request): Response
    {
        $this->validateRequest($request);

        $fields = $request->all();
        $fields['dictionary_id'] = $uuid;

        $model = DictionaryItem::create($fields);
        foreach($fields['i18n'] as $i18n) {
            if (!$i18n['id']) {
                $i18n['dictionary_id'] = $model->id;
                $i18n['language_id'] = $i18n['language']['id'];
                DictionaryItemI18n::create($i18n);
            }
        }

        $model = DictionaryItem::find($model->id);
        return response($model, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return Response
     */
    public function show(string $uuid, string $id): Response
    {
        $model = DictionaryItem::find($id);
        if (!$model) {
            return response(['message' => 'NOT_FOUND'], 404);
        }
        return response($model);
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

        $model = DictionaryItem::find($id);
        foreach($fields['i18n'] as $i18n) {
            if ($i18n['id']) {
                $i18n['dictionary_id'] = $id;
                $i18n['language_id'] = $i18n['language']['id'];
                $i18nModel = DictionaryItemI18n::find($i18n['id']);
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
        $model = DictionaryItem::find($id);
        foreach($model->i18n as $i18n) {
            DictionaryItemI18n::destroy($i18n->id);
        }
        if ($model->cover) {
            Media::destroy($model->cover->id);
        }

        return response(DictionaryItem::destroy($id));
    }

    private function validateRequest(Request $request)
    {
        $fields = [
            'dictionary_id' => 'required',
            'media_id' => 'required',
            'i18n' => 'required|array',
        ];
        $request->validate($fields);
    }
}
