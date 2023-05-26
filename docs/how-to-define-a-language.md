# How Languages Are Defined

1. Add the new language code to the array `supportedLanguages` in [../src/i18n/baseConfig.ts](/src/i18n/baseConfig.ts)
2. Add an entry to default language file [../public/locales/en-US/translations.json]() with the key being `language_{languageCode}`. ex. `language_en-US`
3. Create a folder in [../public/locales/](/public/locales) with the language code as its name.
4. Add a new file, `translations.json`, to the new folder
5. Translate all the entries.  If you prefer to use the english version just set the value to `null`.
