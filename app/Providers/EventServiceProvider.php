<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Models\Card;
use App\Models\Dictionary;
use App\Models\DictionaryItem;
use App\Observers\CardObserver;
use App\Observers\DictionaryObserver;
use App\Observers\DictionaryItemObserver;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        Card::observe(new CardObserver());
        Dictionary::observe(new DictionaryObserver());
        DictionaryItem::observe(new DictionaryItemObserver());
    }
}
