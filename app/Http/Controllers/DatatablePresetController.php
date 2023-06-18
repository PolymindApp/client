<?php

namespace App\Http\Controllers;

use App\Models\DatatablePreset;

class DatatablePresetController extends BaseCrudController
{
    protected $model = DatatablePreset::class;
    protected $searchFields = ['name'];
}
