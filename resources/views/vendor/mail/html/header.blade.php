<table border="0" align="center" cellpadding="30" cellspacing="0" role="presentation" width="100%"
       style="width:100%;max-width:100%;">
    <!-- lotus-header-18-->
    <tr>
        <td align="center" bgcolor="#1B8E8A" class="container-padding">

            <!-- Content -->
            <table border="0" align="center" cellpadding="10" cellspacing="0" role="presentation" class="row" width="580"
                   style="width:580px;max-width:580px;">
{{--                <tr>--}}
{{--                    <td height="40" style="font-size:40px;line-height:40px;">&nbsp;</td>--}}
{{--                </tr>--}}
{{--                <tr>--}}
{{--                    <td align="center">--}}
{{--                        <!-- Logo & Webview -->--}}
{{--                        <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"--}}
{{--                               width="100%" style="width:100%;max-width:100%;">--}}
{{--                            <tr>--}}
{{--                                <td align="center" class="container-padding">--}}

{{--                                    <!--[if (gte mso 9)|(IE)]>--}}
{{--                                    <table border="0" cellpadding="0" cellspacing="0" dir="rtl">--}}
{{--                                        <tr>--}}
{{--                                            <td><![endif]-->--}}


{{--                                    <!--[if (gte mso 9)|(IE)]></td>--}}
{{--                                    <td><![endif]-->--}}

{{--                                    <!-- gap -->--}}
{{--                                    <table border="0" align="right" cellpadding="0" cellspacing="0" role="presentation"--}}
{{--                                           class="row" width="20" style="width:20px;max-width:20px;">--}}
{{--                                        <tr>--}}
{{--                                            <td height="20" style="font-size:20px;line-height:20px;">&nbsp;</td>--}}
{{--                                        </tr>--}}
{{--                                    </table>--}}
{{--                                    <!-- gap -->--}}

{{--                                    <!--[if (gte mso 9)|(IE)]></td>--}}
{{--                                    <td><![endif]-->--}}

{{--                                    <!-- column -->--}}
{{--                                    <table border="0" align="center" cellpadding="0" cellspacing="0" role="presentation"--}}
{{--                                           class="row" width="280" style="width:280px;max-width:280px;">--}}
{{--                                        <tr>--}}
{{--                                            <td align="center" class="center-text">--}}
{{--                                                <a href="{{ $url }}" target="_blank">--}}
{{--                                                    @if (trim($slot) === 'Laravel')--}}
{{--                                                        <img src="https://laravel.com/img/notification-logo.png"--}}
{{--                                                             align="center" border="0" alt="Logo" title="Logo"--}}
{{--                                                             style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 13%;max-width: 88.4px;"--}}
{{--                                                             width="88.4" class="v-src-width v-src-max-width">--}}
{{--                                                    @else--}}
{{--                                                        {{ $slot }}--}}
{{--                                                    @endif--}}
{{--                                                </a>--}}
{{--                                            </td>--}}
{{--                                        </tr>--}}
{{--                                    </table>--}}
{{--                                    <!-- column -->--}}

{{--                                    <!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]-->--}}

{{--                                </td>--}}
{{--                            </tr>--}}
{{--                        </table>--}}
{{--                        <!-- Logo & Webview -->--}}
{{--                    </td>--}}
{{--                </tr>--}}

                <tr>
                    <td align="center" class="center-text">
                        <img style="width:190px;border:0px;display: inline!important;"
                             src="{{ url('assets/images/emails/logo-light.png') }}" width="100" border="0"
                             alt="intro">
                    </td>
                </tr>


                @if (! empty($greeting))
                    <tr>
                        <td class="center-text" align="center"
                            style="font-family:'Roboto Slab',Arial,Helvetica,sans-serif;font-size:42px;line-height:52px;font-weight:400;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">

                            <div>
                                {{ $greeting }}
                            </div>

                        </td>
                    </tr>
                @endif

                @if (! empty($subtitle))
                    <tr>
                        <td height="10" style="font-size:10px;line-height:10px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td class="center-text" align="center"
                            style="font-family:'Roboto Slab',Arial,Helvetica,sans-serif;font-size:26px;line-height:36px;font-weight:400;font-style:normal;color:#d7e057;text-decoration:none;letter-spacing:0px;">

                            <div>
                                {{ $subtitle }}
                            </div>

                        </td>
                    </tr>
                @endif

                {{-- Intro Lines --}}
                @foreach ($introLines as $line)
                    <tr>
                        <td class="center-text" align="center"
                            style="font-family:'Poppins',Arial,Helvetica,sans-serif;font-size:16px;line-height:26px;font-weight:300;font-style:normal;color:#FFFFFF;text-decoration:none;letter-spacing:0px;">

                            <div>
                                {{ $line }}
                            </div>

                        </td>
                    </tr>
                @endforeach

                @if (!empty($actionUrl) && !empty($actionText))
                    <tr>
                        <td align="center">
                            <!-- Header Button -->
                            <table border="0" cellspacing="0" cellpadding="0" role="presentation" align="center"
                                   class="center-float">
                                <tr>
                                    <td align="center" bgcolor="#d6df58" style="border-radius: 6px;">
                                        <!--[if (gte mso 9)|(IE)]>
                                        <table border="0" cellpadding="0" cellspacing="0" align="center">
                                            <tr>
                                                <td align="center" width="50"></td>
                                                <td align="center" height="20" style="height:50px;">
                                        <![endif]-->

                                        <a href="{{ $actionUrl }}" target="_blank"
                                           style="font-family:'Roboto Slab',Arial,Helvetica,sans-serif;font-size:16px;line-height:19px;font-weight:700;font-style:normal;color:#000000;text-decoration:none;letter-spacing:0px;padding: 20px 50px 20px 50px;display: inline-block;"><span>{{ strtoupper($actionText) }}</span></a>

                                        <!--[if (gte mso 9)|(IE)]>
                                        </td>
                                        <td align="center" width="50"></td>
                                        </tr>
                                        </table>
                                        <![endif]-->
                                    </td>
                                </tr>
                            </table>
                            <!-- Header Button -->
                        </td>
                    </tr>
                @endif
            </table>
            <!-- Content -->

        </td>
    </tr>
</table>
