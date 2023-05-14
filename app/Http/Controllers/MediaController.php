<?php

namespace App\Http\Controllers;

use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{

    private function saveToStorageIfNecessary(Media $media, Request $request)
    {
        $fields = $request->all();
        unset($fields['id']);

        $file = tmpfile();
        $path = stream_get_meta_data($file)['uri'];
        file_put_contents($path, file_get_contents($fields['url']));
        $mimeType = mime_content_type($path);
        $splittedMimeType = explode('/', $mimeType);

        if ($splittedMimeType[0] === 'image') {
            $extension = $splittedMimeType[1];
            $filename = 'medias/' . $media->id . '.' . $extension;
            Storage::disk('s3')->put($filename, fopen($path, 'r+'), 'public');
            $url = Storage::disk('s3')->url($filename);
            unset($fields['url']);
            $media->update(array_merge($fields, [
                'mime_type' => $mimeType,
                'file_size' => filesize($path),
                'url' => $url,
            ]));
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $this->validateRequest($request);

        $fields = $request->all();
        unset($fields['url']);

        $media = Media::create($fields);
        $this->saveToStorageIfNecessary($media, $request);

        $media = Media::find($media->id);
        return response($media);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return Response
     */
    public function show(string $id): Response
    {
        return response(Media::find($id));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  string  $id
     * @return Response
     */
    public function update(Request $request, string $id): Response
    {
        $this->validateRequest($request);

        $media = Media::find($id);
        $this->saveToStorageIfNecessary($media, $request);

        return response($media);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $id
     * @return Response
     */
    public function destroy(string $id): Response
    {
        return response(Media::destroy($id));
    }

    /**
     * Bulk remove the specified resources from storage.
     *
     * @param  array  $ids
     * @return Response
     */
    public function bulkDestroy(Request $request): Response
    {
        $destroyedMedias = [];
        foreach($request->all() as $id) {
            $destroyedMedias[] = Media::destroy($id);
        }
        return response($destroyedMedias);
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

    private function validateRequest(Request $request)
    {
        $fields = [];
        $request->validate($fields);
    }
}
