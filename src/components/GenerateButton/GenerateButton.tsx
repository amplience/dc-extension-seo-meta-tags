import { Button, ButtonProps } from "@mui/material";
import type { ContentFieldExtension } from "dc-extensions-sdk";
// import { generateValues } from "./generateValues";
import { useEffect, useState } from "react";
import { hasContent } from "./hasContent";
import { track } from "../../lib/gainsight";
import { EXTENSION_NAME, getParams } from "../../lib";

export const GenerateButton = ({
  sdk,
  onTextGenerated,
  disabled,
  ...props
}: ButtonProps & {
  sdk: ContentFieldExtension;
  onTextGenerated: { (v: string[]): void };
}) => {
  const [canGenerate, setCanGenerate] = useState(false);

  const trackingParams = {
    name: EXTENSION_NAME,
    category: "Extension",
    type: getParams(sdk).type,
  };

  useEffect(() => {
    const enableButtonIfContentInForm = (form: Record<string, unknown>) =>
      setCanGenerate(hasContent(sdk, form));

    sdk.form.getValue().then(enableButtonIfContentInForm).catch();
    sdk.form.onFormValueChange(enableButtonIfContentInForm);
  }, [sdk]);

  const handleClick = async () => {
    // const values = await generateValues(sdk);
    const values = ["title one", "title two", "title three"];

    if (values) {
      track(window, "SEO generation", trackingParams);
      onTextGenerated(values);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outlined"
      disabled={disabled || !canGenerate}
      {...props}
    >
      Generate
    </Button>
  );
};
