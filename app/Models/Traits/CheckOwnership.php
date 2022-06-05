<?php

namespace App\Models\Traits;

use App\Scopes\OwnerScope;

trait CheckOwnership
{
    protected static function bootCheckOwnership()
    {
        static::addGlobalScope(new OwnerScope);
    }
}
