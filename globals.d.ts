declare interface EmscriptenModule {
  ccall: (
    ident: string,
    returnType: string,
    argTypes: string[],
    args: any[]
  ) => any;
  cwrap: (
    ident: string,
    returnType: string,
    argTypes: string[]
  ) => (...args: any[]) => any;
  UTF8ToString: (ptr: number) => string;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
}

declare module "/chess_minimax_c.js" {
  // Define the Module type

  // Default export: factory function returning a Promise of the module
  export default function createModule(): Promise<EmscriptenModule>;
}
