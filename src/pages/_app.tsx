import { NextUIProvider } from '@nextui-org/react'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import 'normalize.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>mytinder</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      </Head>

      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>

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
