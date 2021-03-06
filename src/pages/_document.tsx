import { CssBaseline } from '@nextui-org/react'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        {CssBaseline.flush()}

        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.fbAsyncInit = function () {};
              ;(function(d, s, id){
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) { return; }
              js = d.createElement(s); js.id = id;
              js.src = "https://connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
              `
          }}
          id="fb-sdk-init"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
