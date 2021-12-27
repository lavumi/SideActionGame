import * as JSBReflection from "./JSBReflection";

declare global {
    interface Window {
        JSBReflection : any
    }
  }

  window.JSBReflection = JSBReflection;
