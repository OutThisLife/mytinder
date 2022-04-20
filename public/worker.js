;(self => {
  const CACHE_KEY = 'MYTINDER'

  self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))
  self.addEventListener('install', e => e.waitUntil(self.skipWaiting()))

  self.addEventListener('fetch', e =>
    e.respondWith(
      (async () => {
        const r = e.request

        if (!/json$|api|tinder/.test(r.url)) {
          return fetch(r.clone())
        }

        const cache = await caches.open(CACHE_KEY)
        const res = await cache.match(r.clone())

        if (res) {
          return res
        }

        const xhr = await fetch(r.clone())
        cache.put(r, xhr.clone())

        return xhr
      })()
    )
  )

  self.addEventListener('message', async e => {
    const cache = await caches.open(CACHE_KEY)

    if (e.data === 'all') {
      ;(await self.clients.matchAll()).forEach(c => c.postMessage('revalidate'))
    } else {
      ;(await cache.keys())
        .filter(k => (e.data === 'all' ? k : k.url.includes(`${e.data}`)))
        .forEach(k => cache.delete(k))
    }
  })
})(self)
