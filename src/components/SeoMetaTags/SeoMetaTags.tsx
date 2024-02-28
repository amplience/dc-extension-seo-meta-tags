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
  const placeholder = getPlaceholder(sdk);
  const theme = useTheme();
  const [selectedPanel, setSelectedPanel] = useState<
    "insights" | "preview" | null
  >(null);
  const [initialised, setInitialised] = useState(false);
  const insightsSelected = selectedPanel === "insights";
  // const previewSelected = selectedPanel === "preview";
  const hasOptions = options.length > 0;
  const panelOpen = selectedPanel !== null;

  useEffect(() => {
    (sdk.field.getValue() as Promise<string | undefined>).then((val = "") => {
      setInputValue(val);
    });
  }, [sdk]);

  useEffect(() => {
    if (!initialised) {
      setInitialised(true);
      return;
    }

    sdk.field.setValue(inputValue);
  }, [sdk, initialised, setInitialised, inputValue]);

  const titleSelected = (title: string) => {
    setOptions([]);
    setInputValue(title);
    sdk.field.setValue(title);
  };

  const hidePanels = () => setSelectedPanel(null);

  const clearOptions = () => setOptions([]);

  const generationStarted = () => setGenerating(true);
  const generationComplete = () => setGenerating(false);

  // TEST:
  // SeoMetaTags
  // getMutation
  // generateValues
  // generateButton
  // insightsbutton

  return (
    <div data-testid="seo-component">
      <Grid container direction="column">
        <Grid item container spacing={1} flexWrap="nowrap" alignItems="end">
          <Grid item>
            <SparklesIcon />
          </Grid>
          <Grid item flexGrow={1}>
            <Typography
              variant="title"
              color={readOnly ? theme.palette.grey[300] : ""}
            >
              {title}
            </Typography>
            <Stack direction="row" spacing={0.5}>
              <Typography variant="subtitle">{description}</Typography>
              <Link
                href="https://amplience.com/developers/docs/knowledge-center/amplience-labs"
                target="_blank"
                underline="none"
                variant="link"
              >
                Amplience Labs Preview
              </Link>
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
                  onTitleSelected={titleSelected}
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
    </div>
  );
};
