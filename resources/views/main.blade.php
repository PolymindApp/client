<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
    <link rel="icon" href="{{ asset('favicon.ico') }}">
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <title>{{ $title ?? 'Polymind' }}</title>

    <meta property="og:title" content="{{ $title ?? 'Polymind' }}">
    <meta property="og:site_name" content="{{ env('APP_NAME') }}">
    <meta property="og:url" content="{{ Request::url() }}">
    <meta property="og:description" content="{{ $description ?? __('seo.default.description') }}">
    <meta property="og:type" content="music.playlist">
    <meta property="og:image" content="{{ url('assets/images/manifest/icon512.png') }}">

    <meta property="twitter:url" content="{{ env('TWITTER_URL') }}" />
    <meta property="twitter:image" content="{{ url('assets/images/manifest/icon512.png') }}" />
    <meta property="twitter:description" content="{{ $description ?? __('seo.default.description') }}" />
    <meta name="twitter:title" content="{{ $title ?? 'Polymind' }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="{{ env('TWITTER_TAG') }}">
    <meta name="twitter:creator" content="{{ env('TWITTER_TAG') }}">
</head>
<body>
<noscript>
    <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
</noscript>
<div id="app"></div>
<script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
