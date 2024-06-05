# Boilerplate: Vue & [OmnI18n](https://www.npmjs.com/package/omni18n)

All Points of Interests are denoted with a `PoI` so one can ctrl-shift-F `PoI` with case/whole words to find them.
These are points where things become project-dependant.

## Files

### plugins/i18n.ts

Provides `{ locale, T, client }` in `app.$i18n`.

`locale` and `client` are `ref`s respectively to the locale(string) and the `Translator`.

The client can be used to access the presently used locale, timezones, &c

The plugins will load the partial dictionary on SSR, so that when happening on client side, it will be retrieved through page data

### server/middleware/i18n.ts

Provides `event.context.i18n` with `{ client, server, source }`

### server/api/i18n.ts

Provides access for:

- The user to change language, but also signal errors and missing translations.
  A specific access is added to retrieve a partial translation, but this is only used on SSR and the data retrieved through page data.
- TODO: Translators interactions (get/put)
- TODO: Developers interactions (patch/delete)
