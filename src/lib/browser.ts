import type { Browser } from 'puppeteer-core'

export default async (): Promise<Browser> => {
  const chromium = (await import('chrome-aws-lambda')).default

  const opts = {
    args: chromium.args,
    defaultViewport: { height: 720, width: 1280 },
    headless: true,
    ignoreHTTPSErrors: true
  }

  if (!(await chromium.executablePath)) {
    return (await import('puppeteer-core')).launch(opts)
  }

  return chromium.puppeteer.launch(opts)
}
