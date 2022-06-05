<?php

namespace App\Http\Controllers;

use App\Models\Dictionary;
use App\Models\DictionaryCategory;
use App\Models\DictionaryItem;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DictionaryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        return response(Dictionary::all());
    }

    /**
     * Display a specific resource.
     *
     * @return Response
     */
    public function show(string $uuid): Response
    {
        return response(Dictionary::find($uuid));
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function category(): Response
    {
        return response(DictionaryCategory::all());
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function items(Request $request, string $uuid): Response
    {
        $query = DictionaryItem::where([
            'dictionary_id' => $uuid,
        ]);

        if ($request->get('lang')) {
            $locales = explode(',', $request->get('lang'));
            $languages = Language::whereIn('code', $locales)->select('id')->get()->toArray();
            $languageIds = array_values(array_map(function ($item) {
                return $item['id'];
            }, $languages));
            $query->with(['i18n' => function($query) use ($languageIds) {
                $query->ofLanguages($languageIds);
            }]);
        }

        return response($query->get());
    }
}
