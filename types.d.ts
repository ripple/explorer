declare module 'react-i18next' {
  type Module = (props: any) => JSX.Element;
  function translate(): (module: Module) => Module;
}
