declare module 'hbs' {
  const hbs: {
    registerPartials(path: string): void;
    registerHelper(name: string, fn: (...args: unknown[]) => unknown): void;
  };
  export default hbs;
}
