import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { ReactElement, useEffect, useState } from "react";
import { ContentFieldExtensionContext } from "./ContentFieldExtensionContext";
import { hasContent } from "../lib";

export const WithContentFieldExtension = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [sdk, setSdk] = useState<ContentFieldExtension>();
  const [canGenerate, setCanGenerate] = useState(false);
  const [readOnly, setReadonly] = useState(false);

  useEffect(() => {
    init<ContentFieldExtension>()
      .then(setSdk)
      .catch((e) => {
        console.error("Could not initialise SDK", e);
      });
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

  return (
    sdk && (
      <ContentFieldExtensionContext.Provider
        value={{ sdk, canGenerate, readOnly }}
      >
        {children}
      </ContentFieldExtensionContext.Provider>
    )
  );
};
