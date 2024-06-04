import { I18nClient, I18nServer } from 'omni18n'

export default defineEventHandler(async (event) => {
	//const name = getRouterParam(event, 'name')
	const q = getQuery(event),
		{ client, server }: { client: I18nClient; server: I18nServer } = event.context.i18n
	switch (event.method) {
		case 'POST':
			if (q.missing) {
				const { key } = await readBody(event)
				// Fake fallback, we don't care about the return value but without it, the function throws
				client.missing(key, 'client-side')
				event.node.res.statusCode = 204
				break
			}
			if (q.error) {
				const { key, error, spec } = await readBody(event)
				event.context.i18n.client.error(key, error, { ...spec, clientSide: true })
				event.node.res.statusCode = 204
				break
			}
			if (q.partial) {
				await client.enter()
				event.node.res.write(
					JSON.stringify({
						locale: client.locales[0],
						partial: await client.getPartialLoad([])
					})
				)
				event.node.res.statusCode = 200
			}
			const { locale } = await readBody(event)
			if (locale && locale !== client.locales[0]) {
				client.setLocales([locale, ...client.locales])
				setCookie(event, 'language', locale)
			}
			event.node.res.write(JSON.stringify(await server.condense(client.locales)))
			event.node.res.statusCode = 200
			break
	}
})
