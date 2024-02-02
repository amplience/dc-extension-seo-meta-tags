import { useContext, useState } from "react";
import { ContentFieldExtensionContext } from "../hooks/useFieldExtension";
import { Button, Grid, Link, Stack, Typography } from "@mui/material";
import { SparklesIcon } from "./SparklesIcon";
import { SeoField } from "./SeoField";

export const SeoMetaTags = () => {
  const sdk = useContext(ContentFieldExtensionContext);
  const [inputValue] = useState(sdk.initialValue || undefined);

  if (!sdk) {
    return <p>Loading</p>;
  }

  const isInactive = sdk.readOnly;

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
                  {sdk.field.schema.title}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <Typography variant="subtitle">
                    Generate an effective SEO{" "}
                    {sdk.field.schema.title?.toLowerCase()} based on the content
                    of the page.
                  </Typography>
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
              <span>
                <Button variant="outlined" disabled={isInactive}>
                  Generate
                </Button>
              </span>
            </Grid>
          </Grid>
          <Grid item xs>
            <SeoField schema={sdk.field.schema} value={inputValue} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
