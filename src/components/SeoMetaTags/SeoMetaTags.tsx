import { useContext, useEffect, useState } from "react";
import { Grid, LinearProgress, Link, Stack, Typography } from "@mui/material";
import { SparklesIcon } from "../SparklesIcon";
import { ContentFieldExtensionContext } from "../../hooks/ContentFieldExtensionContext";
import { GenerateButton } from "../GenerateButton/GenerateButton";
import { getTitle } from "./getTitle";
import { getDescription } from "./getDescription";
import { getPlaceholder } from "./getPlaceholder";
import { TitleOptions } from "../TitleOptions/TitleOptions";
import { useTheme } from "@mui/material";
import { InsightsPanel } from "../InsightsPanel/InsightsPanel";
import { InsightsButton } from "../InsightsButton";
import { PreviewButton } from "../PreviewButton";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Fade } from "../animation/Fade";
import { ErrorMessage } from "../ErrorMessage.";
import { PreviewPanel } from "../PreviewPanel/PreviewPanel";
import { broadcastValue } from "./broadcastValue";
import { TextField } from "./TextField";
import { getParams } from "../../lib";
import { KeywordsField } from "./KeywordsField";

export const SeoMetaTags = () => {
  const { sdk, readOnly, broadcastChannel } = useContext(
    ContentFieldExtensionContext
  );
  const { type } = getParams(sdk!);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const title = getTitle(sdk!);
  const description = getDescription(sdk!);
  const theme = useTheme();
  const [selectedPanel, setSelectedPanel] = useState<
    "insights" | "preview" | null
  >(null);
  const [placeholder, setPlaceholder] = useState(getPlaceholder(sdk!));
  const [generationError, setGenerationError] = useState<string | null>(null);
  const insightsSelected = selectedPanel === "insights";
  const previewSelected = selectedPanel === "preview";
  const hasOptions = options.length > 0;
  const panelOpen = selectedPanel !== null;
  const isKeywords = type === "keywords";

  useEffect(() => {
    (sdk!.field.getValue() as Promise<string | undefined>).then((val = "") => {
      setInputValue(val);
      broadcastValue(broadcastChannel!, sdk!, val);
    });
  }, [sdk, broadcastChannel]);

  const fieldChanged = (value: string) => {
    setInputValue(value);
    sdk!.field.setValue(value);
  };

  const optionSelected = (option: string) => {
    clearOptions();
    setInputValue(option);
    sdk!.field.setValue(option);
  };

  const hidePanels = () => setSelectedPanel(null);

  const clearOptions = () => {
    setOptions([]);
    setPlaceholder(getPlaceholder(sdk!));
  };

  const generationStarted = () => {
    setGenerating(true);
    setGenerationError(null);
  };

  const textGenerated = (variants: string[]) => {
    if (type === "keywords") {
      sdk!.field.setValue(variants[0]);
      setInputValue(variants[0]);
    } else {
      setOptions(variants);
    }
  };

  const generationComplete = () => setGenerating(false);

  return (
    <Grid
      container
      data-testid="seo-component"
      flexWrap="nowrap"
      spacing={2}
      paddingBottom={2}
    >
      <Grid item>
        <SparklesIcon />
      </Grid>
      <Grid container item direction="column" overflow="hidden">
        <Grid item container spacing={1} flexWrap="nowrap" alignItems="end">
          <Grid item container flexGrow={1} direction="column">
            <Typography
              variant="title"
              color={readOnly ? theme.palette.grey[300] : ""}
            >
              {title}
            </Typography>
            <Stack direction="row" spacing={2}>
              <LayoutGroup>
                {!generationError && (
                  <Fade layoutId="descrpition">
                    <Typography variant="subtitle">
                      {description}{" "}
                      <Link
                        href="https://amplience.com/developers/docs/knowledge-center/amplience-labs"
                        target="_blank"
                        underline="none"
                        variant="link"
                        sx={{ whiteSpace: "nowrap", fontSize: "12px" }}
                      >
                        Amplience Labs Preview
                      </Link>
                    </Typography>
                  </Fade>
                )}
                {generationError && (
                  <Fade layoutId="error">
                    <ErrorMessage error={generationError} />
                  </Fade>
                )}
              </LayoutGroup>
            </Stack>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1}>
              <InsightsButton
                selected={insightsSelected}
                onSelect={setSelectedPanel}
                disabled={hasOptions}
              />
              <PreviewButton
                selected={previewSelected}
                onSelect={setSelectedPanel}
                disabled={hasOptions}
              />
              <GenerateButton
                onStartGeneration={generationStarted}
                onFinishGeneration={generationComplete}
                onTextGenerated={textGenerated}
                onError={setGenerationError}
                disabled={panelOpen || hasOptions}
              ></GenerateButton>
            </Stack>
          </Grid>
        </Grid>
        <Grid item maxWidth="100%!important">
          <Stack spacing={3} marginTop={1}>
            <LayoutGroup>
              {!generating && (
                <div>
                  {isKeywords ? (
                    <KeywordsField value={inputValue} onChange={fieldChanged} />
                  ) : (
                    <TextField
                      disabled={panelOpen}
                      placeholder={placeholder}
                      value={inputValue}
                      onChange={fieldChanged}
                    />
                  )}
                </div>
              )}
              {generating && (
                <Fade layoutId="progress">
                  <LinearProgress sx={{ marginTop: "24px" }} />
                </Fade>
              )}
            </LayoutGroup>
            <AnimatePresence>
              {hasOptions && (
                <TitleOptions
                  options={options}
                  onSelected={optionSelected}
                  onChange={setPlaceholder}
                  onCancel={clearOptions}
                ></TitleOptions>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {insightsSelected && (
                <InsightsPanel value={inputValue} onClose={hidePanels} />
              )}
            </AnimatePresence>
            <AnimatePresence>
              {previewSelected && (
                <PreviewPanel
                  value={inputValue}
                  onClose={hidePanels}
                ></PreviewPanel>
              )}
            </AnimatePresence>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};
