<?php

namespace App\Observers;

use App\Http\Helpers\Polly;
use App\Models\Card;
use App\Models\Voice;

class CardObserver
{
    private function updateStreams(Card &$model)
    {
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
    }
}