declare module 'react-i18next' {
  type Module = (
    props: Props
  ) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
  function translate(): (module: Module) => Module;
}
