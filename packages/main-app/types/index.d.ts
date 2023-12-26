export {};

declare global {
  interface Window  {
    __POWERED_BY_MICRO__: boolean,
    [k: string]: any
  }
}
