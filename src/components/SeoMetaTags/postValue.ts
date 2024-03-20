import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib";

export const postValue = (
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
