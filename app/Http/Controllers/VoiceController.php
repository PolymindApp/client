<?php

namespace App\Http\Controllers;

use App\Models\Voice;
use Illuminate\Http\Response;

class VoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        return response(Voice::with(['language'])->get());
    }
}
