declare module "gif.js" {
  // Minimal type declaration — gif.js doesn't ship with .d.ts files.
  // We use `unknown` for the constructor + methods; the runtime API is documented at
  // https://github.com/jnordberg/gif.js
  const GIF: new (opts: Record<string, unknown>) => unknown;
  export default GIF;
}
