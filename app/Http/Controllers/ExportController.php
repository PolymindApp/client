<?php

namespace App\Http\Controllers;

use App\Models\Card;
use FFMpeg\Format\Audio\Mp3;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class ExportController extends Controller
{
    /**
     * Export and download a portable audio version of the given ids
     *
     * @param Request $request
     * @return Response|string
     */
    public function audio(Request $request): Response|string
    {
        $ids = $request->get('ids');
        $name = $request->get('name');
        $settings = $request->get('settings');

        $cards = Card::find($ids);
        if ($cards->count() === 0) {
            return response(['message' => 'NO_CARDS_FOUND'], 401);
        }

        // Concat all synthesized voices
        $files = [];
        $silence = resource_path('app/assets/sounds/silence-1s.mp3');
        copy($silence, storage_path('app/silence.mp3'));
        foreach ($cards as $card) {
            $sides = empty($settings['mode']) ? ['front', 'back'] : [$settings['mode']];
            if ($settings['flipped']) {
                $sides = array_reverse($sides);
            }
            for ($y = 0; $y < $settings['repeat']; $y++) {
                foreach($sides as $side) {
                    $sidePath = $card->id . '.' . $side . '.mp3';
                    file_put_contents(storage_path('app/' . $sidePath), base64_decode(substr($card->{$side . '_synthesized'}, strlen("data:audio/mp3;base64,"))));
                    $files[] = $sidePath;

                    for ($i = 0; $i < $settings['delay']; $i++) {
                        $files[] = 'silence.mp3';
                    }
                }
            }
        }
        if ($settings['reversed']) {
            $files = array_reverse($files);
        }
        if (count($files) === 0) {
            return response(['message' => 'EMPTY'], 400);
        }

        $exportFilename = bin2hex(openssl_random_pseudo_bytes(16)) . '.mp3';
        $exportPath = storage_path('app/' . $exportFilename);
        $format = (new Mp3)->setAudioKiloBitrate(64);
        FFMpeg::fromDisk('local')
            ->open($files)
            ->export()
            ->inFormat($format)
            ->concatWithTranscoding($hasVideo = false, $hasAudio = true)
            ->save($exportFilename);

        // Clear files
        foreach($files as $file) {
            $filePath = storage_path('app/' . $file);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        // Download file to browser
        header("Cache-Control: public");
        header("Content-Type: audio/mpeg");
        header("Content-Transfer-Encoding: Binary");
        header("Content-Length:" . filesize($exportPath));
        header("Content-Disposition: inline; filename=" . $name . ".mp3");
        readfile($exportPath);
        unlink($exportPath);
        unlink(storage_path('app/silence.mp3'));
        die;
    }
}
