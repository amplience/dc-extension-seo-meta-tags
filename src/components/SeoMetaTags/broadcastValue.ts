import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib";

export const broadcastValue = (
  channel: BroadcastChannel,
  sdk: ContentFieldExtension,
  value: string
) => {
  const { type, sources } = getParams(sdk);
  channel.postMessage({
    type,
    sources,
    value,
  });
};
