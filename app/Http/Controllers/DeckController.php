<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DeckController extends Controller
{
    public function web(Request $request, string $id)
    {
        $deck = Deck::find($id);
        return view('main', isset($deck) ? [
            'title' => $deck['name'],
            'description' => trans_choice('seo.deck.play.desc', $deck['total_cards'], [
                'total' => $deck['total_cards'] ?? "0",
                'front_language' => $deck['default_front_voice']['language']['name'],
                'back_language' => $deck['default_back_voice']['language']['name'],
            ])
        ] : []);
    }

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        return response(Deck::with(['default_front_voice', 'default_back_voice'])->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $this->validateRequest($request);

        $deck = Deck::create($request->all());
        return response($deck);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return Response
     */
    public function show(string $id): Response
    {
        $deck = Deck::find($id);
        if (!$deck) {
            return response(['message' => 'NOT_FOUND'], 404);
        }
        return response($deck);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param  string  $id
     * @return Response
     */
    public function update(Request $request, string $id): Response
    {
        $this->validateRequest($request);

        $deck = Deck::find($id);
        $deck->update($request->all());
        return response($deck);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $id
     * @return Response
     */
    public function destroy(string $id): Response
    {
        Card::where('deck_id', '=', $id)->delete();
        return response(Deck::destroy($id));
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
        $results = Deck::where('name', 'LIKE', '%' . $query . '%')->get();
        return response($results);
    }

    private function validateRequest(Request $request)
    {
        $fields = [
            'name' => 'string|required',
            'default_front_voice_id' => 'int|required',
        ];
        if (!$request->get('single')) {
            $fields['default_back_voice_id'] = 'int|required';
        }
        $request->validate($fields);
    }
}
