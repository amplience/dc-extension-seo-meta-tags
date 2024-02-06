import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext, useContext } from "react";

export type ContentFieldExtensionContext = {
  sdk: ContentFieldExtension | null;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContext>({ sdk: null });

export const useContentFieldExtension = (): ContentFieldExtensionContext => {
  return useContext(ContentFieldExtensionContext);
};
