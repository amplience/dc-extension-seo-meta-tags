import { Button, ButtonProps } from "@mui/material";
import type { ContentFieldExtension } from "dc-extensions-sdk";
// import { generateValues } from "./generateValues";
import { useContext } from "react";
import { track } from "../../lib/gainsight";
import { EXTENSION_NAME, getParams } from "../../lib";
import { ContentFieldExtensionContext } from "../../hooks/ContentFieldExtensionContext";

export const GenerateButton = ({
  onTextGenerated,
  ...props
}: ButtonProps & {
  onTextGenerated: { (v: string[]): void };
}) => {
  const { sdk, canGenerate, readOnly } = useContext(
    ContentFieldExtensionContext
  ) as ContentFieldExtensionContext & { sdk: ContentFieldExtension };

  const trackingParams = {
    name: EXTENSION_NAME,
    category: "Extension",
    type: getParams(sdk).type,
  };

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
      disabled={readOnly || !canGenerate}
      {...props}
    >
      Generate
    </Button>
  );
};
