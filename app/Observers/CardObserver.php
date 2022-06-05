<?php

namespace App\Observers;

use App\Http\Helpers\Polly;
use App\Models\Card;
use App\Models\Deck;
use App\Models\Voice;

class CardObserver
{
    private function updateStreams(Card &$model)
    {
        // Skip if user not logged-in (a way to prevent Seeders from querying AWS too much)
        if (!auth()->user()) {
            return;
        }

        $polly = new Polly();
        $id = $model['id'] ?? null;
        $oldModel = $id ? Card::find($id) : null;
        foreach(['front', 'back'] as $side) {
            $text = $model[$side] ?? null;
            $voiceId = $model[$side . '_voice_id'] ?? null;
            $different = $oldModel === null || $oldModel[$side] !== $text || $oldModel[$side . '_voice_id'] !== $voiceId;
            if ($different && $text && $voiceId) {
                $voice = Voice::find($voiceId);
                $stream = $polly->getDataStream($text, $voice->language->code, $voice->name, $voice->standard === 1);
                $model[$side . '_synthesized'] = 'data:audio/mp3;base64,' . base64_encode($stream);
            }
        }
    }

    private function updateDeckTotalCards(string $deckId)
    {
        if ($deckId) {
            $deck = Deck::find($deckId);
            if ($deck) {
                $deck->total_card = Card::where('deck_id', '=', $deckId)->count();
                $deck->save();
            }
        }
    }

    /**
     * Function will be triggerd when a user is created
     *
     * @param Card $model
     */
    public function creating(Card $model)
    {
        $this->updateStreams($model);
    }

    /**
     * Function will be triggerd when a user is updated
     *
     * @param Card $model
     */
    public function updating(Card $model)
    {
        $this->updateStreams($model);

        $oldModel = Card::find($model['id']);
        if ($oldModel['deck_id'] !== $model['deck_id']) {
            if ($oldModel['deck_id']) {
                $this->updateDeckTotalCards($oldModel['deck_id'], -1);
            }
            if ($model['deck_id']) {
                $this->updateDeckTotalCards($model['deck_id'], 1);
            }
        }
    }

    public function created(Card $model)
    {
        if ($model['deck_id']) {
            $this->updateDeckTotalCards($model['deck_id']);
        }
    }

    public function deleted(Card $model)
    {
        if ($model['deck_id']) {
            $this->updateDeckTotalCards($model['deck_id']);
        }
    }
}
