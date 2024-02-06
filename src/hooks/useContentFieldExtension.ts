import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext, useContext } from "react";

export type ContentFieldExtensionContextState = {
  sdk: ContentFieldExtension | null;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContextState>({ sdk: null });

export const useContentFieldExtension =
  (): ContentFieldExtensionContextState => {
    return useContext(ContentFieldExtensionContext);
  };
