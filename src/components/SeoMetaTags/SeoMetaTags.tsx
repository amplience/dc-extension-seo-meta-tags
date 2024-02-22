import { useContext, useEffect, useState } from "react";
import { Grid, Link, Stack, TextField, Typography } from "@mui/material";
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
import { AnimatePresence } from "framer-motion";

export const SeoMetaTags = () => {
  const { sdk, readOnly } = useContext(
    ContentFieldExtensionContext
  ) as ContentFieldExtensionContext & {
    sdk: ContentFieldExtension;
  };
  const [initialValue, setInitialValue] = useState("");
  const [inputValue, setInputValue] = useState("");

  const [options, setOptions] = useState<string[]>([]);
  const title = getTitle(sdk);
  const description = getDescription(sdk);
  const placeholder = getPlaceholder(sdk);
  const theme = useTheme();
  const [selectedPanel, setSelectedPanel] = useState<
    "insights" | "preview" | null
  >(null);
  const insightsSelected = selectedPanel === "insights";
  // const previewSelected = selectedPanel === "preview";
  const hasOptions = options.length > 0;
  const panelOpen = selectedPanel !== null;

  useEffect(() => {
    (sdk.field.getValue() as Promise<string | undefined>).then((val = "") => {
      setInputValue(val);
      setInitialValue(val);
    });
  }, [sdk]);

  useEffect(() => {
    const unchanged = initialValue === inputValue;

    if (unchanged) {
      return;
    }
    sdk.field.setValue(inputValue);
  }, [sdk, inputValue, initialValue]);

  const titleSelected = (title: string) => {
    setOptions([]);
    setInputValue(title);
    sdk.field.setValue(title);
  };

  const hidePanels = () => setSelectedPanel(null);

  const clearOptions = () => setOptions([]);

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
              />
              {/* <PreviewButton
                selected={previewSelected}
                onSelect={setSelectedPanel}
              /> */}
              <GenerateButton
                onTextGenerated={setOptions}
                disabled={panelOpen}
              ></GenerateButton>
            </Stack>
          </Grid>
        </Grid>
        <Grid item>
          <Stack spacing={3}>
            <TextField
              fullWidth
              onChange={withValue(setInputValue)}
              placeholder={placeholder}
              value={inputValue}
              variant="standard"
              disabled={panelOpen}
            />
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
