<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Voice;
use App\Http\Helpers\Polly;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        return response(Card::where([
            'deck_id' => $request->get('deckId')
        ])->orderBy('created_at', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $request->validate([
            'deck_id' => 'string|nullable',
            'front_voice_id' => 'int|nullable',
            'back_voice_id' => 'int|nullable',
            'front' => 'string|required',
            'back' => 'string|required',
        ]);

        $data = $request->all();
        $polly = new Polly();
        foreach(['front', 'back'] as $side) {
            $voiceId = $data[$side . '_voice_id'] ?? null;
            if ($voiceId) {
                $voice = Voice::find($voiceId);
                $stream = $polly->getDataStream($data[$side], $voice->language->code, $voice->name, $voice->standard === 1);
                $data[$side . '_synthesized'] = 'data:audio/mp3;base64,' . base64_encode($stream);
            }
        }

        $card = Card::find(Card::create($data)->id);
        return response($card);
    }

    /**
     * Bulk store resources in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function bulkStore(Request $request): Response
    {
        $newCards = [];
        foreach($request->all() as $data) {
            $newCards[] = Card::find(Card::create($data)->id);
        }
        return response($newCards);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return Response
     */
    public function show(string $id): Response
    {
        return response(Card::find($id));
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
        $card = Card::find($id);
        $card->update($request->all());
        return response($card);
    }

    /**
     * Bulk update the specified resources in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function bulkUpdate(Request $request): Response
    {
        $newCards = [];
        foreach($request->all() as $data) {
            $card = Card::find($data['id']);
            $card->update($data);
            $newCards[] = Card::find($data['id']);
        }
        return response($newCards);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $id
     * @return Response
     */
    public function destroy(string $id): Response
    {
        return response(Card::destroy($id));
    }

    /**
     * Bulk remove the specified resources from storage.
     *
     * @param  array  $ids
     * @return Response
     */
    public function bulkDestroy(Request $request): Response
    {
        $destroyedCards = [];
        foreach($request->all() as $id) {
            $destroyedCards[] = Card::destroy($id);
        }
        return response($destroyedCards);
    }

    /**
     * Search for resources
     *
     * @param  string  $query
     * @return Response
     */
    public function search(string $query): Response
    {
        return response();
    }
}
