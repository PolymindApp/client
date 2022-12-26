<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(): Response
    {
        return response(User::all());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request): Response
    {
        $this->validateRequest($request, true);

        $fields = $request->all();
        $fields['password'] = bcrypt($fields['password']);

        $user = User::create($fields);
        $token = $user->createToken(env('APP_KEY'))->plainTextToken;
        $user->notify(new VerifyEmail());

        return response([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $id
     * @return Response
     */
    public function show(string $id): Response
    {
        $model = User::find($id);
        if (!$model) {
            return response(['message' => 'NOT_FOUND'], 404);
        }
        return response($model);
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
        $hasPassword = (bool) $request->get('password');
        $this->validateRequest($request, $hasPassword);

        $fields = $request->all();
        if ($hasPassword) {
            $fields['password'] = bcrypt($fields['password']);
        }

        $model = User::find($id);
        $model->update($fields);
        return response($model);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  string  $id
     * @return Response
     */
    public function destroy(string $id): Response
    {
        return response(User::destroy($id));
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
        $results = User::where('email', 'LIKE', '%' . $query . '%')->get();
        return response($results);
    }

    private function validateRequest(Request $request, $passwordRequired = false)
    {
        $fields = [
            'name' => 'string',
            'email' => 'required|email:rfc,dns|unique:users,email',
            'password' => ($passwordRequired ? 'required|' : '') . 'string|confirmed',
        ];
        $request->validate($fields);
    }
}
