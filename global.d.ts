declare module "react" {
  const React: any
  export = React
}

declare module "react/jsx-runtime" {
  const jsx: any
  export = jsx
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}
