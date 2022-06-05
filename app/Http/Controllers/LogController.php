<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LogController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        return response(Log::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $request->validate([]);

        $log = Log::create($request->all());
        return response($log);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return Response
     */
    public function show(string $id): Response
    {
        return response(Log::find($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, int $id): Response
    {
        $log = Log::find($id);
        $log->update($request->all());
        return response($log);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $id
     * @return Response
     */
    public function destroy(string $id): Response
    {
        return response(Log::destroy($id));
    }

    /**
     * Search for resources in storage
     *
     * @return Response
     */
    public function search(): Response
    {
        if (!isset($_GET['q'])) {
            return response(['message' => 'NO_QUERY_PARAM'], 400);
        }
        $query = trim($_GET['q']);
        $results = Log::where('name', 'LIKE', '%' . $query . '%')->get();
        return response($results);
    }
}
