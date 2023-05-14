<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRole;
use App\Notifications\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AdminUserController extends BaseAdminController
{
    protected $model = User::class;
    protected $searchFields = ['name', 'email'];

    /**
     * Create or update a list of resources in storage.
     *
     * @param Request $request
     * @return Response
     * @throws ValidationException
     */
    public function bulkStore(Request $request): Response
    {
        $users = [];
        $items = $request->all();
        foreach($items as $item) {
            $this->validateItem($item, $item['id'] === null, false, $item['id'] === null);
        }
        foreach($items as $item) {
            if ($item['id'] === null) {
                $item['password'] = bcrypt($item['password']);
                $user = User::create($item);

                foreach($item['roles'] as $role) {
                    UserRole::create([
                        'user_id' => $user->id,
                        'role_id' => $role,
                    ]);
                }

                $user->notify(new VerifyEmail());
                $user = User::find($user->id);
            } else {
                if (isset($item['password'])) {
                    $item['password'] = bcrypt($item['password']);
                }

                UserRole::where('user_id', '=', $item['id'])->delete();
                foreach($item['roles'] as $role) {
                    UserRole::create([
                        'user_id' => $item['id'],
                        'role_id' => $role,
                    ]);
                }

                $user = User::find($item['id']);
                $user->update($item);
            }
            $users[] = $user;
        }

        return response($users, 201);
    }

    /**
     * @throws ValidationException
     */
    protected function validateItem($fields, $passwordRequired = false, $confirmationRequired = false, $uniqueEmail = false)
    {
        return Validator::make($fields, [
            'name' => 'string|min:3|max:255',
            'email' => 'required|max:255|email:rfc,dns' . ($uniqueEmail ? '|unique:users,email' : ''),
            'roles' => 'required|array',
            'password' => ($passwordRequired ? 'required|' : '') . 'string|max:255' . ($confirmationRequired ? '|confirmed' : ''),
        ])->validate();
    }
}
