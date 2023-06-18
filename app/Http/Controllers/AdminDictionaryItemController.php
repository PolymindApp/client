<?php

namespace App\Http\Controllers;

use App\Models\DictionaryItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class AdminDictionaryItemController extends BaseCrudController
{
    protected $model = DictionaryItem::class;

    public function index(Request $request): Response
    {
        $this->filters[] = function (Builder &$query) use ($request) {
            $query->where('dictionary_id', $request->route('uuid'));;
        };
        return parent::index($request);
    }

    protected function validateItem($fields): array
    {
        return Validator::make($fields, [
            'dictionary_id' => 'required',
            'i18n' => 'required|array',
        ])->validate();
    }
}
