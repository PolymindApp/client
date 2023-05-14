<?php

namespace App\Http\Controllers;

use App\Models\Voice;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdminVoiceController extends BaseAdminController
{
    protected $model = Voice::class;
    protected $searchFields = ['name'];

    /**
     * @throws ValidationException
     */
    protected function validateItem($fields)
    {
        return Validator::make($fields, [
            'name' => 'string|min:3|max:16',
            'gender' => 'boolean',
            'neural' => 'boolean',
            'standard' => 'boolean',
            'bilingual' => 'boolean',
            'child' => 'boolean',
        ])->validate();
    }
}
