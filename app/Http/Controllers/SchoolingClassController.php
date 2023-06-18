<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SchoolingClassController extends BaseCrudController
{
    protected $model = SchoolClass::class;
    protected $searchFields = ['name'];

    /**
     * @throws ValidationException
     */
    protected function validateItem($fields)
    {
        return Validator::make($fields, [

        ])->validate();
    }
}
