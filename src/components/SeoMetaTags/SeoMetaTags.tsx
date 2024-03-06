import { useContext, useEffect, useState } from "react";
import {
  Grid,
  LinearProgress,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SparklesIcon } from "../SparklesIcon";
import { ContentFieldExtensionContext } from "../../hooks/ContentFieldExtensionContext";
import { GenerateButton } from "../GenerateButton/GenerateButton";
import { ContentFieldExtension } from "dc-extensions-sdk";
import { getTitle } from "./getTitle";
import { getDescription } from "./getDescription";
import { withValue } from "../../lib/events/withValue";
import { getPlaceholder } from "./getPlaceholder";
import { TitleOptions } from "../TitleOptions/TitleOptions";
import { useTheme } from "@mui/material";
import { InsightsPanel } from "../InsightsPanel/InsightsPanel";
import { InsightsButton } from "../InsightsButton";
// import { PreviewButton } from "../PreviewButton";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Fade } from "../animation/Fade";
import { ErrorMessage } from "../ErrorMessage.";

export const SeoMetaTags = () => {
  const { sdk, readOnly } = useContext(
    ContentFieldExtensionContext
  ) as ContentFieldExtensionContext & {
    sdk: ContentFieldExtension;
  };
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const title = getTitle(sdk);
  const description = getDescription(sdk);
  const theme = useTheme();
  const [selectedPanel, setSelectedPanel] = useState<
    "insights" | "preview" | null
  >(null);
  const [initialised, setInitialised] = useState(false);
  const [placeholder, setPlaceholder] = useState(getPlaceholder(sdk));
  const [error, setError] = useState<string | null>(null);
  const insightsSelected = selectedPanel === "insights";
  // const previewSelected = selectedPanel === "preview";
  const hasOptions = options.length > 0;
  const panelOpen = selectedPanel !== null;

  useEffect(() => {
    (sdk.field.getValue() as Promise<string | undefined>).then((val = "") =>
      setInputValue(val)
    );
  }, [sdk]);

  useEffect(() => {
    if (!initialised) {
      setInitialised(true);
      return;
    }

    sdk.field.setValue(inputValue);
  }, [sdk, initialised, setInitialised, inputValue]);

  const optionSelected = (option: string) => {
    clearOptions();
    setInputValue(option);
    sdk.field.setValue(option);
  };

  const hidePanels = () => setSelectedPanel(null);

  const clearOptions = () => {
    setOptions([]);
    setPlaceholder(getPlaceholder(sdk));
  };

  const generationStarted = () => {
    setGenerating(true);
    setError(null);
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
      <Grid container item direction="column">
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
                {!error && (
                  <Fade layoutId="descrpition">
                    <Typography variant="subtitle">
                      {description}{" "}
                      <Link
                        href="https://amplience.com/developers/docs/knowledge-center/amplience-labs"
                        target="_blank"
                        underline="none"
                        variant="link"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        Amplience Labs Preview
                      </Link>
                    </Typography>
                  </Fade>
                )}
                {error && (
                  <Fade layoutId="error">
                    <ErrorMessage error={error} />
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
              {/* <PreviewButton
                selected={previewSelected}
                onSelect={setSelectedPanel}
              /> */}
              <GenerateButton
                onStartGeneration={generationStarted}
                onFinishGeneration={generationComplete}
                onTextGenerated={setOptions}
                onError={setError}
                disabled={panelOpen || hasOptions}
              ></GenerateButton>
            </Stack>
          </Grid>
        </Grid>
        <Grid item>
          <Stack spacing={3} marginTop={1}>
            <LayoutGroup>
              {!generating && (
                <Fade layoutId="textField">
                  <TextField
                    fullWidth
                    onChange={withValue(setInputValue)}
                    placeholder={placeholder}
                    value={inputValue}
                    variant="standard"
                    disabled={panelOpen}
                    inputProps={{
                      sx: {
                        color: theme.palette.grey[200],
                        "&::placeholder": {
                          color: theme.palette.grey[600],
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </Fade>
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
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};
