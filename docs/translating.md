# Translating the Application

## How Languages Are Defined

1. Add the new language code and language name to the map `supportedLanguages` in [/src/i18n/baseConfig.ts](../src/i18n/baseConfig.ts)
2. Create a folder in [/public/locales/](../public/locales) with the language code as its name.
3. Add a new file, `translations.json`, to the new folder.
4. Translate all the entries.  If you prefer to use the English version just set the value to `null`.

   Example file: [/public/locales/ja-JP/translations.json](../public/locales/ja-JP/translations.json)

## Updating Existing Translations

When making changes to the base (English) language file follow the guide based on the type and scope of the change.

### New Entry
1. Create entry in `en-US/translations.json`
2. Add an entry to all other `translation.json` files. Set the value to be `null` (which means it will default to using the English version).

## Existing Entry
1. Update the entry in `en-US/translations.json`
2. If the meaning does **NOT** change materially, you can leave them as is. Ex. "Please check your transaction hash" => "Please check your transaction hash or CTID."
3. If the entry has a new meaning than before, set the value to `null` in all other `translation.json` files.
     
  *Note that changing a translation to `null` causes it to fall back to the English version, and is a signal to language contributors that they may want to provide a fresh localization.*
