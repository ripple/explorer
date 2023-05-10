// import the original type declarations
import 'react-i18next'

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  // and extend them!
  interface CustomTypeOptions extends I18nextCustomTypeOptions {}
}
