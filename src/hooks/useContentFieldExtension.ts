import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext } from "react";

export type ContentFieldExtensionContext = {
  sdk: ContentFieldExtension | null;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContext>({ sdk: null });
