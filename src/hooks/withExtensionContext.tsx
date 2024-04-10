import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { ReactElement, useEffect, useState } from "react";
import { ExtensionContext } from "./ExtensionContext";
import { getParams, hasContent } from "../lib";
import { isEmpty, symmetricDifference } from "ramda";

export const WithExtensionContext = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [sdk, setSdk] = useState<ContentFieldExtension>();
  const [canGenerate, setCanGenerate] = useState(false);
  const [readOnly, setReadonly] = useState(false);
  const [broadcastChannel, setBroadcastChannel] =
    useState<BroadcastChannel | null>(null);
  const [seoValues, setSeoValues] = useState({ title: "", description: "" });

  useEffect(() => {
    init<ContentFieldExtension>()
      .then(setSdk)
      .catch((e) => {
        console.error("Could not initialise SDK", e);
      });

    setBroadcastChannel(new BroadcastChannel("SEO"));
  }, []);

  useEffect(() => {
    if (!sdk) {
      return;
    }

    const enableIfContentInForm = (form: Record<string, unknown>) =>
      setCanGenerate(hasContent(sdk, form));

    sdk.frame.startAutoResizer();
    sdk.form.getValue().then(enableIfContentInForm);
    sdk.form.onFormValueChange(enableIfContentInForm);
    sdk.form.onReadOnlyChange(setReadonly);
  }, [sdk]);

  useEffect(() => {
    if (!broadcastChannel || !sdk) {
      return;
    }

    broadcastChannel.onmessage = ({ data }) => {
      const { type, sources } = getParams(sdk);
      const sameSrc = isEmpty(symmetricDifference(data.sources, sources));
      const notSameType = type !== data.type;
      if (sameSrc && notSameType) {
        setSeoValues({
          ...seoValues,
          [data.type]: data.value,
        });
      }
    };
  }, [broadcastChannel, sdk, seoValues]);

  return (
    sdk && (
      <ExtensionContext.Provider
        value={{ sdk, canGenerate, readOnly, broadcastChannel, seoValues }}
      >
        {children}
      </ExtensionContext.Provider>
    )
  );
};
