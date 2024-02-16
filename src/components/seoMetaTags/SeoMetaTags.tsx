import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { SparklesIcon } from "../SparklesIcon";
import { ContentFieldExtensionContext } from "../../hooks/useContentFieldExtension";
import { GenerateButton } from "../GenerateButton/GenerateButton";
import { ContentFieldExtension } from "dc-extensions-sdk";
import { getTitle } from "./getTitle";
import { getDescription } from "./getDescription";
import { withValue } from "../../lib/events/withValue";
import { getPlaceholder } from "./getPlaceholder";
import { when } from "ramda";
import { isNotEmpty } from "ramda-adjunct";
import { TitleOptions } from "../TitleOptions/TitleOptions";
import InsightsIcon from "../../assets/insights-icon.svg?react";
import PreviewIcon from "../../assets/preview-icon.svg?react";
import { useTheme } from "@mui/material";
import { InisghtsPanel } from "../InsightsPanel/InsightsPanel";

export const SeoMetaTags = () => {
  const { sdk } = useContext(ContentFieldExtensionContext) as {
    sdk: ContentFieldExtension;
  };
  const [initialValue, setInitialValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isInactive, setInactive] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const title = getTitle(sdk);
  const description = getDescription(sdk);
  const placeholder = getPlaceholder(sdk);
  const theme = useTheme();

  useEffect(() => {
    (sdk.field.getValue() as Promise<string | undefined>).then((val = "") => {
      setInputValue(val);
      setInitialValue(val);
    });
    sdk.form.onReadOnlyChange(setInactive);
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

  return (
    <div data-testid="seo-component">
      <Grid container spacing={1} width="100%">
        <Grid item xs="auto">
          <SparklesIcon inactive={isInactive} />
        </Grid>
        <Grid container item spacing={1} xs direction="column">
          <Grid container item xs justifyContent="flex-end">
            <Grid item xs>
              <Stack direction="column">
                <Typography
                  variant="title"
                  color={isInactive ? theme.palette.grey[300] : ""}
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
              </Stack>
            </Grid>
            <Grid item xs="auto">
              <Tooltip title="SEO scoring & insights" placement="bottom">
                <IconButton sx={{ stroke: "black" }}>
                  <SvgIcon component={InsightsIcon}></SvgIcon>
                </IconButton>
              </Tooltip>
              <Tooltip title="SERP Preview" placement="bottom">
                <IconButton sx={{ stroke: "black", fill: "none" }}>
                  <SvgIcon component={PreviewIcon}></SvgIcon>
                </IconButton>
              </Tooltip>
              <GenerateButton
                disabled={isInactive}
                sdk={sdk}
                onTextGenerated={setOptions}
              ></GenerateButton>
            </Grid>
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              onChange={withValue(setInputValue)}
              placeholder={placeholder}
              value={inputValue}
              variant="standard"
            />
            <InisghtsPanel></InisghtsPanel>
          </Grid>
        </Grid>
      </Grid>
      {when(
        isNotEmpty,
        () => (
          <Grid container>
            <Grid item>
              <TitleOptions
                options={options}
                onTitleSelected={titleSelected}
              ></TitleOptions>
            </Grid>
          </Grid>
        ),
        options
      )}
    </div>
  );
};
