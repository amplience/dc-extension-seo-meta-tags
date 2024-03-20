import {
  Box,
  Button,
  Grid,
  LinearProgress,
  LinearProgressProps,
  Typography,
  useTheme,
} from "@mui/material";
import PlusIcon from "../../assets/plus-icon.svg?react";
import MinusIcon from "../../assets/minus-icon.svg?react";
import { getError, getParams, toSdkError } from "../../lib";
import { ContentFieldExtension } from "dc-extensions-sdk";
import { useContext, useEffect, useState } from "react";
import { ContentFieldExtensionContext } from "../../hooks/ContentFieldExtensionContext";
import { Chart } from "./Chart";
import upperFirst from "lodash/upperFirst";
import { Insights, getInsights } from "./getInsights";
import { AnimatePresence } from "framer-motion";
import { Card } from "../Card";
import { getColour } from "./getColour";
import { FadeGrow } from "../animation/FadeGrow";

const description = `These scores are generated by ChatGPT; trained on a series of detailed and highly specific guidance around SEO best practices and optimisations.

This score is advisory and based on a wide range of considerations subject to ChatGPT and it's training interpretations. It is not definitive and should (as always) be tested and validated against a well-considered SEO strategy and implementation plan.`;

const InsightBox = ({
  insights,
  type,
}: {
  insights: string[];
  type: "positive" | "negative";
}) => {
  const theme = useTheme();
  const isPositive = type === "positive";
  const icon = isPositive ? <PlusIcon /> : <MinusIcon />;
  const backgroundColor = isPositive
    ? theme.palette.success.light
    : theme.palette.error.light;

  return (
    <Box
      sx={{ backgroundColor, color: theme.palette.grey[200] }}
      padding={2}
      data-testid={`insights-${type}`}
    >
      <Typography
        component="h2"
        variant="title"
        fontWeight={500}
        display="flex"
        gap={1}
      >
        {icon} {upperFirst(type)} signs
      </Typography>
      <ul style={{ paddingLeft: "21px" }}>
        {insights.map((insight) => (
          <li key={insight} style={{ marginBottom: "10px" }}>
            {insight}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export const InsightsPanel = ({
  value,
  onClose,
}: {
  value: string;
  onClose: { (): void };
}) => {
  const { sdk } = useContext(ContentFieldExtensionContext) as {
    sdk: ContentFieldExtension;
  };
  const theme = useTheme();
  const { type } = getParams(sdk);
  const [insightsVisible, setInsightsVisible] = useState(false);
  const btnText = insightsVisible ? "Hide insights" : "View insights";
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Insights>();
  const [error, setError] = useState<string | null>(null);

  const loadInsights = () => {
    setLoading(true);
    setError(null);
    getInsights(sdk)
      .then((results) => {
        if (results) {
          setResults(results);
        } else {
          setError(getError(toSdkError("BAD_CONTENT")));
        }
      })
      .catch((e) => setError(getError(e)))
      .finally(() => setLoading(false));
  };

  useEffect(loadInsights, [sdk]);

  const viewInsights = () => setInsightsVisible(!insightsVisible);

  return (
    <div data-testid="insightsPanel">
      <Card
        title="SEO Scoring & Insights"
        info={description}
        loading={loading}
        onClose={onClose}
      >
        {results && (
          <>
            <Typography variant="body1" component="p" marginBottom={2}>
              <Typography variant="subtitle" component="span">
                Showing results for meta {type}:
              </Typography>
              <br />
              <b>"{value}"</b>
            </Typography>
            <Box marginBottom={2}>
              <Typography
                variant="title"
                component="h2"
                fontWeight={500}
                color={theme.palette.text.primary}
                marginBottom={0.5}
              >
                Overall score:{" "}
                <b style={{ color: theme.palette.grey[200] }}>
                  {results.overallScore}/100
                </b>
              </Typography>

              <LinearProgress
                variant="determinate"
                color={
                  getColour(
                    results.overallScore
                  ) as LinearProgressProps["color"]
                }
                value={results.overallScore}
              />
            </Box>
            <Grid
              container
              gap={2}
              alignItems="center"
              flexWrap="nowrap"
              minHeight={45}
            >
              <Grid
                item
                container
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <Chart percentage={results.charactersScore}></Chart>
                <Typography variant="title" fontWeight={500}>
                  {upperFirst(type)} Length
                </Typography>
              </Grid>
              <Grid
                item
                container
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <Chart percentage={results.readabilityScore}></Chart>
                <Typography variant="title" fontWeight={500}>
                  Readability
                </Typography>
              </Grid>
              <Grid
                item
                flexGrow={1}
                container
                alignItems="center"
                justifyContent="center"
                gap={1}
              >
                <Chart percentage={results.accessibilityScore}></Chart>
                <Typography variant="title" fontWeight={500}>
                  Accessibility
                </Typography>
              </Grid>
              <Grid item flexShrink={0}>
                <Button
                  onClick={viewInsights}
                  variant="outlined"
                  sx={{
                    borderColor: theme.palette.grey[500],
                    color: theme.palette.grey[200],
                  }}
                >
                  {btnText}
                </Button>
              </Grid>
            </Grid>
            <AnimatePresence>
              {insightsVisible && (
                <FadeGrow layoutId="insights">
                  <Grid container spacing={2} marginTop={0.1} flexWrap="nowrap">
                    <Grid item container flexGrow={1} xs={6}>
                      <InsightBox
                        type="positive"
                        insights={results.positive}
                      ></InsightBox>
                    </Grid>
                    <Grid item container flexGrow={1} xs={6}>
                      <InsightBox
                        type="negative"
                        insights={results.negative}
                      ></InsightBox>
                    </Grid>
                  </Grid>
                </FadeGrow>
              )}
            </AnimatePresence>
          </>
        )}
        {error && (
          <Grid container justifyContent="center">
            <Grid item textAlign="center">
              <p style={{ color: theme.palette.grey[200] }}>
                <b>Sorry, something went wrong.</b>
              </p>
              <p>[ERROR] {error}</p>
              <p>
                <Button variant="contained" onClick={loadInsights}>
                  Retry
                </Button>
              </p>
            </Grid>
          </Grid>
        )}
      </Card>
    </div>
  );
};
