import { useContext, useEffect, useState } from "react";
import { Grid, Link, Stack, TextField, Typography } from "@mui/material";
import { SparklesIcon } from "../SparklesIcon";
import { ContentFieldExtensionContext } from "../../hooks/useContentFieldExtension";
import { GenerateButton } from "../GenerateButton";
import { ContentFieldExtension } from "dc-extensions-sdk";
import { getTitle } from "./getTitle";
import { getDescription } from "./getDescription";

export const SeoMetaTags = () => {
  const { sdk } = useContext(ContentFieldExtensionContext) as {
    sdk: ContentFieldExtension;
  };
  const [inputValue, setInputValue] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [isInactive, setInactive] = useState(false);
  const title = getTitle(sdk);
  const description = getDescription(sdk);

  useEffect(() => {
    (sdk.field.getValue() as Promise<string>).then((val) => {
      setInputValue(val);
      setLoaded(true);
    });
    sdk.form.onReadOnlyChange(setInactive);
  }, [sdk]);

  useEffect(() => {
    if (!loaded) {
      return;
    }
    sdk.field.setValue(inputValue);
  }, [sdk, inputValue, loaded]);

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
              <GenerateButton disabled={isInactive}></GenerateButton>
            </Grid>
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              onChange={({ target: { value } }) => setInputValue(value)}
              value={inputValue}
              variant="standard"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
