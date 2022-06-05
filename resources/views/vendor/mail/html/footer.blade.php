<table border="0" align="center" cellpadding="10" cellspacing="0" role="presentation" width="100%"
       style="width:100%;max-width:100%;">
    <!-- lotus-footer-4 -->
    <tr>
        <td align="center" bgcolor="#f0f0f0" class="container-padding">

            <!-- Content -->
            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation" class="row" width="580"
                   style="width:580px;max-width:580px;">
                <tr>
                    <td align="center">
                        <!-- Social Icons -->
                        <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"
                               width="100%" style="width:100%;max-width:100%;">
                            <tr>
                                <td align="center">
                                    <table border="0" align="center" cellpadding="0" cellspacing="0"
                                           role="presentation">
                                        <tr>
                                            <td class="rwd-on-mobile" align="center" valign="middle" height="36"
                                                style="height: 36px;">
                                                @if( config('polymind.facebook_url') != '')
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0"
                                                           role="presentation">
                                                        <tr>
                                                            <td width="10"></td>
                                                            <td align="center">
                                                                <a href="{{ config('polymind.facebook_url') }}"><img
                                                                        style="width:36px;border:0px;display: inline!important;"
                                                                        src="{{ asset('assets/images/emails/facebook.png') }}"
                                                                        width="36" border="0" alt="icon"></a>
                                                            </td>
                                                            <td width="10"></td>
                                                        </tr>
                                                    </table>
                                                @endif
                                            </td>
                                            <td class="rwd-on-mobile" align="center" valign="middle" height="36"
                                                style="height: 36px;">
                                                @if( config('polymind.twitter_url') != '')
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0"
                                                           role="presentation">
                                                        <tr>
                                                            <td width="10"></td>
                                                            <td align="center">
                                                                <a href="{{ config('polymind.twitter_url') }}"><img
                                                                        style="width:36px;border:0px;display: inline!important;"
                                                                        src="{{ asset('assets/images/emails/twitter.png') }}"
                                                                        width="36" border="0" alt="icon"></a>
                                                            </td>
                                                            <td width="10"></td>
                                                        </tr>
                                                    </table>
                                                @endif
                                            </td>
                                            <td class="rwd-on-mobile" align="center" valign="middle" height="36"
                                                style="height: 36px;">
                                                @if( config('polymind.linkedin_url') != '')
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0"
                                                           role="presentation">
                                                        <tr>
                                                            <td width="10"></td>
                                                            <td align="center">
                                                                <a href="{{ config('polymind.linkedin_url') }}"><img
                                                                        style="width:36px;border:0px;display: inline!important;"
                                                                        src="{{ asset('assets/images/emails/linkedin.png') }}"
                                                                        width="36" border="0" alt="icon"></a>
                                                            </td>
                                                            <td width="10"></td>
                                                        </tr>
                                                    </table>
                                                @endif
                                            </td>
                                            <td class="rwd-on-mobile" align="center" valign="middle" height="36"
                                                style="height: 36px;">
                                                @if( config('polymind.github_url') != '')
                                                    <table border="0" align="center" cellpadding="0" cellspacing="0"
                                                           role="presentation">
                                                        <tr>
                                                            <td width="10"></td>
                                                            <td align="center">
                                                                <a href="{{ config('polymind.github_url') }}"><img
                                                                        style="width:36px;border:0px;display: inline!important;"
                                                                        src="{{ asset('assets/images/emails/github.png') }}"
                                                                        width="36" border="0" alt="icon"></a>
                                                            </td>
                                                            <td width="10"></td>
                                                        </tr>
                                                    </table>
                                                @endif
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <!-- Social Icons -->
                    </td>
                </tr>
                <tr>
                    <td height="30" style="font-size:30px;line-height:30px;">&nbsp;</td>
                </tr>
                <tr>
                    <td class="center-text" align="center"
                        style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;font-weight:400;font-style:normal;color:#6e6e6e;text-decoration:none;letter-spacing:0px;">

                        {{ __('mail.copyrights', [
                            'date' => date('Y'),
                            'name' => config('app.name'),
                        ]) }}

                    </td>
                </tr>
                <tr>
                    <td align="center">
                    @if( config('polymind.google_play_url') != '' || config('polymind.apple_store_url') != '' )
                        <!-- Buttons -->
                            <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"
                                   class="row" width="100%" style="width:100%;max-width:100%;">
                                <tr>
                                    <td align="center">
                                        <!-- column -->
                                        <table border="0" align="center" cellpadding="0" cellspacing="0"
                                               role="presentation">
                                            <tr>
                                                <td align="center">
                                                    <a href="{{config('polymind.apple_store_url')}}"><img
                                                            style="display:block;width:100%;max-width:117px;border:0px;"
                                                            width="117"
                                                            src="{{ asset('assets/images/emails/App-Store.png') }}"
                                                            border="0" alt="icon"></a>
                                                </td>
                                                <td width="10" style="width: 10px;"></td>
                                                <td align="center">
                                                    <a href="{{config('polymind.google_play_url')}}"><img
                                                            style="display:block;width:100%;max-width:117px;border:0px;"
                                                            width="117"
                                                            src="{{ asset('assets/images/emails/Google-play.png') }}"
                                                            border="0" alt="icon"></a>
                                                </td>
                                            </tr>
                                        </table>
                                        <!-- column -->
                                    </td>
                                </tr>
                            </table>
                            <!-- Buttons -->
                        @endif
                    </td>
                </tr>
            </table>
            <!-- Content -->

        </td>
    </tr>
</table>
