<?php

namespace App\Http\Controllers;

use App\Models\Language;
use Illuminate\Http\Response;

class LanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        return response(Language::all());
    }
}
