<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdminLanguageController extends BaseCrudController
{
    protected $model = Language::class;
    protected $searchFields = ['name', 'code'];

    /**
     * @throws ValidationException
     */
    protected function validateItem($fields): array
    {
        return Validator::make($fields, [
            'name' => 'string|required|min:3|max:255',
            'code' => 'string|required|min:5|max:255',
        ])->validate();
    }
}
