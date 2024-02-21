import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import PlusIcon from "../../assets/plus-icon.svg?react";
import MinusIcon from "../../assets/minus-icon.svg?react";
import LoadingIcon from "../../assets/loading-icon.svg?react";
import { EVENTS, getParams } from "../../lib";
import { ContentFieldExtension } from "dc-extensions-sdk";
import { useContext, useEffect, useState } from "react";
import { ContentFieldExtensionContext } from "../../hooks/ContentFieldExtensionContext";
import { Chart } from "./Chart";
import upperFirst from "lodash/upperFirst";
import { getInsights } from "./getInsights";
import { AnimatePresence, motion } from "framer-motion";
import { Card } from "../Card";
import { getColour } from "./getColour";

const Insights = ({
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
    ? theme.palette.success.A100
    : theme.palette.error.A100;

  useEffect(() => {}, []);

  return (
    <Box sx={{ backgroundColor, color: theme.palette.grey[200] }} padding={2}>
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
          <li key={insight}>{insight}</li>
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
  const [results, setResults] = useState({
    overall: 0,
    characters: 0,
    readability: 0,
    accessibility: 0,
  });

  useEffect(() => {
    getInsights(sdk).then((results) => {
      setLoading(false);
      if (results) {
        setResults(results);
      } else {
        sdk.connection.emit(EVENTS.ERROR_TOAST, "Could not get inisights");
      }
    });
  }, [sdk]);

  const viewInsights = () => setInsightsVisible(!insightsVisible);

  const x = ["one", "two", "three"];

  return (
    <motion.div
      key="panel"
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
    >
      <Card
        title="SEO Scoring & Insights"
        info="Description"
        loading={loading}
        onClose={onClose}
      >
        {loading && (
          <Grid container justifyContent="center">
            <Grid item>
              <LoadingIcon />
            </Grid>
          </Grid>
        )}
        <AnimatePresence>
          {!loading && (
            <motion.div
              key="details"
              initial={{ opacity: 0, height: 20 }}
              animate={{ opacity: 1, height: "auto" }}
            >
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
                  Overall score: <b>{results.overall}/100</b>
                </Typography>

                <LinearProgress
                  variant="determinate"
                  color={getColour(results.overall)}
                  value={results.overall}
                />
              </Box>

              <Grid
                container
                gap={2}
                alignItems="center"
                flexWrap="nowrap"
                height={45}
              >
                <Grid item container alignItems="center" gap={1}>
                  <Chart percentage={results.characters}></Chart>
                  <Typography variant="title" fontWeight={500}>
                    Character count
                  </Typography>
                </Grid>
                <Grid item container alignItems="center" gap={1}>
                  <Chart percentage={results.readability}></Chart>
                  <Typography variant="title" fontWeight={500}>
                    Readability
                  </Typography>
                </Grid>
                <Grid item flexGrow={1} container alignItems="center" gap={1}>
                  <Chart percentage={results.accessibility}></Chart>
                  <Typography variant="title" fontWeight={500}>
                    Accessiblity
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
                  <motion.div
                    layout
                    key="insights"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Grid
                      container
                      spacing={2}
                      marginTop={0.1}
                      flexWrap="nowrap"
                    >
                      <Grid item flexGrow={1} xs={6}>
                        <Insights type="positive" insights={x}></Insights>
                      </Grid>
                      <Grid item flexGrow={1} xs={6}>
                        <Insights type="negative" insights={x}></Insights>
                      </Grid>
                    </Grid>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
