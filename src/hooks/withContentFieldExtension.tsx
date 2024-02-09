import { ContentFieldExtension, init } from "dc-extensions-sdk";
import { ReactElement, useEffect, useState } from "react";
import { ContentFieldExtensionContext } from "./useContentFieldExtension";

export const WithContentFieldExtension = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [sdk, setSdk] = useState<ContentFieldExtension>();

  useEffect(() => {
    init<ContentFieldExtension>()
      .then((sdk) => {
        setSdk(sdk);
        sdk.frame.startAutoResizer();
      })
      .catch((e) => {
        console.error("Could not initialise SDK", e);
      });
  }, []);

  return (
    sdk && (
      <ContentFieldExtensionContext.Provider value={{ sdk }}>
        {children}
      </ContentFieldExtensionContext.Provider>
    )
  );
};
