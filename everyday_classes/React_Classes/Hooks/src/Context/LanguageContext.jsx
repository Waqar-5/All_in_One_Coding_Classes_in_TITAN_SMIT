import { createContext } from "react";

// Hack: Passing {} as default avoids the 'undefined' crash
export const LanguageContext = createContext({});