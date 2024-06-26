import { I18nClient, I18nServer, localeFlagsEngine } from 'omni18n'

export default defineEventHandler(async (event) => {
	//const name = getRouterParam(event, 'name')
	const q = getQuery(event),
		{ client, server }: { client: I18nClient; server: I18nServer } = event.context.i18n
	switch (event.method) {
		case 'POST':
			if (q.report !== undefined) {
				const { key, error, spec } = await readBody(event)
				event.context.i18n.client.report(key, error, spec)
				event.node.res.statusCode = 204
				break
			}
			if (q.partial !== undefined) {
				// This is never queried! This is only used on SSR with `useFetch` to retrieve page-data to pass from SSR to hydration
				await client.enter()
				const uaHeader = Array.from(event.headers.entries()).find(([key]) => key === 'user-agent'),
					lfEngine = localeFlagsEngine(uaHeader && uaHeader[1])
				return {
					locale: client.locales[0],
					partial: await client.getPartialLoad([]),
					lfEngine: lfEngine.name
				}
			}
			const { locale } = await readBody(event)
			if (locale && locale !== client.locales[0]) {
				client.setLocales([locale, ...client.locales])
				setCookie(event, 'language', locale)
			}
			return await server.condense(client.locales)
	}
	// TODO: Translators interactions (get/put)
	// TODO: Developers interactions (patch/delete)
})
