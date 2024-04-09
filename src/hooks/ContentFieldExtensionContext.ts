import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext } from "react";

export type ContentFieldExtensionContext = {
  sdk: ContentFieldExtension | null;
  canGenerate: boolean;
  readOnly: boolean;
  broadcastChannel: BroadcastChannel | null;
  seoValues: SeoValues;
};

export const ContentFieldExtensionContext =
  createContext<ContentFieldExtensionContext>({
    sdk: null,
    canGenerate: false,
    readOnly: false,
    broadcastChannel: null,
    seoValues: { title: "", description: "" },
  });
