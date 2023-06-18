<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdminRoleController extends BaseCrudController
{
    protected $model = Role::class;
    protected $searchFields = ['name', 'key'];

    /**
     * @throws ValidationException
     */
    protected function validateItem($fields): array
    {
        return Validator::make($fields, [
            'key' => 'string|min:3|max:16',
            'name' => 'string|min:3|max:64',
        ])->validate();
    }
}
