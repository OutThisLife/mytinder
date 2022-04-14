import { NextUIProvider } from '@nextui-org/react'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import 'normalize.css'
import { Suspense } from 'react'
import { SWRConfig } from 'swr'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>mytinder</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      </Head>

      <main>
        <SWRConfig
          value={{
            fetcher: (k, v) => fetch(k, v).then(r => r.json()),
            revalidateOnFocus: false,
            revalidateOnReconnect: false
          }}>
          <NextUIProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Component {...pageProps} />
            </Suspense>
          </NextUIProvider>
        </SWRConfig>
      </main>

      <Script
        dangerouslySetInnerHTML={{
          __html: `navigator.serviceWorker.register('/worker.js', { scope: '/' })`
        }}
        id="worker-register"
        strategy="beforeInteractive"
      />
    </>
  )
}

export const reportWebVitals = (metric: NextWebVitalsMetric) =>
  console.log(
    metric.name,
    `${metric.startTime?.toFixed(0)} -> ${metric.value?.toFixed(0)}`
  )
