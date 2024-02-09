import { Button, ButtonProps } from "@mui/material";
import type { ContentFieldExtension } from "dc-extensions-sdk";
import { generateValue } from "./generateValue";
import { useEffect, useState } from "react";
import { hasContent } from "./hasContent";
import { track } from "../../gainsight";

export const GenerateButton = ({
  sdk,
  onTextGenerated,
  disabled,
  ...props
}: ButtonProps & {
  sdk: ContentFieldExtension;
  onTextGenerated: { (v: string): void };
}) => {
  const [canGenerate, setCanGenerate] = useState(false);

  const trackingParams = {
    name: "dc-extension-seo-meta-tags",
    category: "Extension",
  };

  useEffect(() => {
    const enableButtonIfContentInForm = (form: Record<string, unknown>) =>
      setCanGenerate(hasContent(sdk, form));

    sdk.form.getValue().then(enableButtonIfContentInForm).catch();
    sdk.form.onFormValueChange(enableButtonIfContentInForm);
  }, [sdk]);

  const handleClick = async () => {
    track(window, "SEO generation", trackingParams);
    const value = await generateValue(sdk);

    if (value) {
      onTextGenerated(value);
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
