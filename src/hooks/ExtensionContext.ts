import { ContentFieldExtension } from "dc-extensions-sdk";
import { createContext } from "react";

export type ExtensionContext = {
  sdk: ContentFieldExtension | null;
  canGenerate: boolean;
  readOnly: boolean;
  broadcastChannel: BroadcastChannel | null;
  seoValues: SeoValues;
};

export const ExtensionContext = createContext<ExtensionContext>({
  sdk: null,
  canGenerate: false,
  readOnly: false,
  broadcastChannel: null,
  seoValues: { title: "", description: "" },
});
