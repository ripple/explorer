# How Languages Are Defined

1. Add the new language code and language name to the map `supportedLanguages` in [/src/i18n/baseConfig.ts](../src/i18n/baseConfig.ts)
2. Create a folder in [/public/locales/](../public/locales) with the language code as its name.
3. Add a new file, `translations.json`, to the new folder.
4. Translate all the entries.  If you prefer to use the English version just set the value to `null`.

   Example file: [/public/locales/ja-JP/translations.json](../public/locales/ja-JP/translations.json)
