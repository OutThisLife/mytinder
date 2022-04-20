import cache from 'memory-cache'

export default async (): Promise<string> => {
  if (!cache.get('fb')) {
    try {
      const browser = await (await import('./browser')).default()

      try {
        const page = await browser.newPage()

        await page.goto(
          `https://www.facebook.com/dialog/oauth?client_id=464891386855067&redirect_uri=https://www.facebook.com/connect/login_success.html&scope=basic_info,email,public_profile,user_about_me,user_activities,user_birthday,user_education_history,user_friends,user_interests,user_likes,user_location,user_photos,user_relationship_details&response_type=token`
        )

        console.log('[INFO]', page.url())

        await page.click('#email')
        await page.keyboard.type(`${process.env.FB_EMAIL}`)

        await page.click('#pass')
        await page.keyboard.type(`${process.env.FB_PASS}`)

        await page.click('#loginbutton')
        await page.waitForNavigation()

        const url = new URL(page.url())

        console.log('[INFO]', url.toString())

        if (!url.pathname.endsWith('login_success.html')) {
          throw new Error('Login failed')
        }

        cache.put(
          'fb',
          new URLSearchParams(url.hash.split('#')?.pop())?.get('access_token'),
          1e3 * 60 * 60 * 24
        )
      } catch (err) {
        throw err
      } finally {
        await browser.close()
      }
    } catch (err) {
      throw err
    }
  }

  return cache.get('fb')
}
