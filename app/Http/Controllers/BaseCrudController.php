<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Config;
use Illuminate\Validation\ValidationException;

class BaseCrudController extends Controller
{
    protected $model;
    protected $searchFields = [];
    protected $filters = [];

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $fields = $request->all();
        $search = $fields['search'] ?? '';
        $all = isset($fields['itemsPerPage']) && $fields['itemsPerPage'] === '-1';
        $sortBy = isset($fields['sortBy']) ? str_replace('data.', '', $fields['sortBy']) : 'created_at';
        $sortDesc = !isset($fields['sortDesc']) || $fields['sortDesc'] === 'true';

        $query = $this->model::select('*');

        foreach($this->searchFields as $key => $field) {
            if ($key === 0) {
                $query->where($field, 'like', '%' . $search . '%');
            } else {
                $query->orWhere($field, 'like', '%' . $search . '%');
            }
        }

        foreach($this->filters as $filter) {
            $filter($query);
        }

        $count = $query->count();
        $data = $query->get()->sortBy($sortBy, null, $sortDesc);

        if (!$all) {
            $limit = isset($fields['itemsPerPage']) ? (int) $fields['itemsPerPage'] : 10;
            $offset = isset($fields['page']) ? (((int) $fields['page']) - 1) * $limit : 0;
            $data = $data->slice($offset, $limit);
        }

        $data = array_values($data->toArray());

        $response = [
            'data' => $data,
            'length' => $count,
        ];

        if (Config::get('app.debug', false)) {
            $response['sql'] = $query->toSql();
            $response['payload'] = $fields;
        }

        return response($response);
    }

    /**
     * Create or update a list of resources in storage.
     *
     * @param Request $request
     * @return Response
     * @throws ValidationException
     */
    public function bulkStore(Request $request): Response
    {
        $results = [];
        $items = $request->all();

        foreach($items as $item) {
            $this->validateItem($item);
        }
        foreach($items as $item) {
            if ($item['id'] === null) {
                $newItem = $this->model::create($item);
            } else {
                $newItem = $this->model::find($item['id']);
                $newItem->update($item);
            }
            $results[] = $newItem;
        }

        return response($results, 201);
    }

    /**
     * Remove a list of resources from storage.
     *
     * @param  Request $request
     * @return Response
     */
    public function bulkDestroy(Request $request): Response
    {
        $results = [];
        foreach($request->all() as $id) {
            $results[] = $this->model::destroy($id);
        }
        return response($results);
    }

    /**
     */
    protected function validateItem($fields): array
    {
        return [];
    }
}
