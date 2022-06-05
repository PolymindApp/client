@component('mail::layout')

    {{-- Header --}}
    @slot('header')
        @component('mail::header', [
            'greeting' => $greeting ?? false,
            'image' => $image ?? false,
            'actionText' => $actionText ?? false,
            'actionUrl' => $actionUrl ?? false,
            'subtitle' => $subtitle ?? false,
            'introLines' => $introLines ?? [],
            'url' => config('app.url'),
        ])
            <img src="{{ asset('assets/images/emails/logo-light.png') }}"
                 align="center" border="0" alt="Logo" title="Logo"
                 style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 85px; height: 89px"
                 width="85" height="89" class="v-src-width v-src-max-width">
        @endcomponent
    @endslot

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')

        @endcomponent
    @endslot

@endcomponent
