import { init } from "dc-extensions-sdk";
import { createContext, useContext, useEffect, useState } from "react";

export const ContentFieldExtensionContext = createContext(undefined);

export const useContentFieldExtension = () => {
  return useContext(ContentFieldExtensionContext);
};

export const WithContentFieldExtension = ({ children, pollForm = true }) => {
  const [sdk, setSdk] = useState(undefined);
  const [initialValue, setInitialValue] = useState(undefined);
  const [formValue, setFormValue] = useState(undefined);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    init()
      .then((sdk) => {
        setReadOnly(sdk.form.readOnly);
        sdk.field
          .getValue()
          .then((val) => {
            setInitialValue(val);
            setSdk(sdk);
          })
          .catch((err) => setSdk(sdk));

        sdk.frame.startAutoResizer();
        sdk.form.onReadOnlyChange((newVal) => {
          setReadOnly(newVal);
        });
      })
      .catch((err) => {});
    return () => {};
  }, []);

  useEffect(() => {
    if (!pollForm || !sdk) {
      return () => {};
    }

    const interval = setInterval(async () => {
      try {
        setFormValue(await sdk.form.getValue());
      } catch (err) {
        setFormValue({});
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [sdk, pollForm]);

  return (
    sdk && (
      <ContentFieldExtensionContext.Provider
        value={{ ...sdk, initialValue, readOnly, formValue }}
      >
        {children}
      </ContentFieldExtensionContext.Provider>
    )
  );
};
