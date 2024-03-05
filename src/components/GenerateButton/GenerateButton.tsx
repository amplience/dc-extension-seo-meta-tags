import { Box, Button } from "@mui/material";
import type { ContentFieldExtension } from "dc-extensions-sdk";
import { generateValues } from "./generateValues";
import { useContext, useState } from "react";
import { track } from "../../lib/gainsight";
import { EXTENSION_NAME, getError, getParams } from "../../lib";
import { ContentFieldExtensionContext } from "../../hooks/ContentFieldExtensionContext";
import { LayoutGroup } from "framer-motion";
import Loader from "../../assets/loading-icon.svg?react";
import { Fade } from "../animation/Fade";

export const GenerateButton = ({
  onTextGenerated,
  onStartGeneration,
  onFinishGeneration,
  onError,
  disabled,
  ...props
}: unknown & {
  disabled?: boolean;
  onTextGenerated: { (v: string[]): void };
  onStartGeneration: { (): void };
  onFinishGeneration: { (): void };
  onError: { (e: string): void };
}) => {
  const { sdk, readOnly } = useContext(
    ContentFieldExtensionContext
  ) as ContentFieldExtensionContext & { sdk: ContentFieldExtension };
  const [generating, setGenerating] = useState(false);

  const trackingParams = {
    name: EXTENSION_NAME,
    category: "Extension",
    type: getParams(sdk).type,
  };

  const handleClick = async () => {
    onStartGeneration();
    setGenerating(true);
    try {
      const values = await generateValues(sdk);

      if (values) {
        track(window, "SEO generation", trackingParams);
        onTextGenerated(values);
      }
    } catch (e) {
      onError(getError(e));
    }

    onFinishGeneration();
    setGenerating(false);
  };

  return (
    <LayoutGroup>
      {generating && (
        <Fade layoutId="loader">
          <Box sx={{ margin: "5px 33px" }} data-testid="loader">
            <Loader />
          </Box>
        </Fade>
      )}
      {!generating && (
        <Fade layoutId="button">
          <Button
            onClick={handleClick}
            variant="outlined"
            disabled={disabled || readOnly}
            sx={{ width: "92px" }}
            {...props}
          >
            Generate
          </Button>
        </Fade>
      )}
    </LayoutGroup>
  );
};
