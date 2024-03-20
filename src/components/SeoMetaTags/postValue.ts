import { ContentFieldExtension } from "dc-extensions-sdk";
import { getParams } from "../../lib";

export const postValue = (
  worker: SharedWorker,
  sdk: ContentFieldExtension,
  value: string
) => {
  const { type, sources } = getParams(sdk);
  worker.port.postMessage({
    type,
    sources,
    value,
  });
};
