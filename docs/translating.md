# Translating the Application

## How Languages Are Defined

1. Add the new language code and language name to the map `supportedLanguages` in [/src/i18n/baseConfig.ts](../src/i18n/baseConfig.ts)
2. Create a folder in [/public/locales/](../public/locales) with the language code as its name.
3. Add a new file, `translations.json`, to the new folder.
4. Translate all the entries.  If you prefer to use the English version just set the value to `null`.

   Example file: [/public/locales/ja-JP/translations.json](../public/locales/ja-JP/translations.json)

## Updating Existing Translations

When making changes to the base (English) language file follow the ?

### New Entry
1. Create entry in `en-US/translations.json`
2. Add an entry to all other `translation.json` files with a value of `null`

## Existing Entry
1. Update the entry in `en-US/translations.json`
2. Update other `translation.json` files
   - Leave entry as is if the string does not change materially. ex. "Please check your transaction hash" => "Please check your transaction hash or CTID."
   - Set the value to `null` in all other language files to fallback to new English string
