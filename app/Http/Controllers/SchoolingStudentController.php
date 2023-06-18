<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class SchoolingStudentController extends BaseCrudController
{
    protected $model = Student::class;
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
