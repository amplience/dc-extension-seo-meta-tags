import { Button, ButtonProps } from "@mui/material";
import type { ContentFieldExtension } from "dc-extensions-sdk";
import { generateValue } from "./generateValue";
import { useEffect, useState } from "react";
import { hasContent } from "./hasContent";

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

  useEffect(() => {
    const enableButtonIfContentInForm = (form: Record<string, unknown>) =>
      setCanGenerate(hasContent(sdk, form));

    sdk.form.getValue().then(enableButtonIfContentInForm);
    sdk.form.onFormValueChange(enableButtonIfContentInForm);
  }, [sdk]);

  const handleClick = async () => {
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
