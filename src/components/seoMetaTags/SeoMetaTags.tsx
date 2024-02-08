import { useContext, useEffect, useState } from "react";
import { Grid, Link, Stack, TextField, Typography } from "@mui/material";
import { SparklesIcon } from "../SparklesIcon";
import { ContentFieldExtensionContext } from "../../hooks/useContentFieldExtension";
import { GenerateButton } from "../GenerateButton/GenerateButton";
import { ContentFieldExtension } from "dc-extensions-sdk";
import { getTitle } from "./getTitle";
import { getDescription } from "./getDescription";
import { withValue } from "../../lib/events/withValue";

export const SeoMetaTags = () => {
  const { sdk } = useContext(ContentFieldExtensionContext) as {
    sdk: ContentFieldExtension;
  };
  const [initialValue, setInitialValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isInactive, setInactive] = useState(false);
  const title = getTitle(sdk);
  const description = getDescription(sdk);

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

  return (
    <div>
      <Grid container spacing={1} width="100%">
        <Grid item xs="auto">
          <SparklesIcon inactive={isInactive} />
        </Grid>
        <Grid container item spacing={1} xs direction="column">
          <Grid container item xs justifyContent="flex-end">
            <Grid item xs>
              <Stack direction="column">
                <Typography variant="title" color={isInactive ? "#BFBFBF" : ""}>
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
              <GenerateButton
                disabled={isInactive}
                sdk={sdk}
                onTextGenerated={setInputValue}
              ></GenerateButton>
            </Grid>
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              onChange={withValue(setInputValue)}
              value={inputValue}
              variant="standard"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
