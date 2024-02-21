import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
  useTheme,
} from "@mui/material";
import { getColour } from "./getColour";

export const Chart = ({ percentage }: { percentage: number }) => {
  const theme = useTheme();

  const colour = getColour<CircularProgressProps["color"]>(percentage);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <Box sx={{ position: "absolute" }}>
        <CircularProgress
          variant="determinate"
          sx={{ color: theme.palette.grey[700] }}
          value={100}
        />
      </Box>
      <Box sx={{ position: "relative" }}>
        <CircularProgress
          variant="determinate"
          color={colour}
          value={percentage}
        />
      </Box>
      <Box
        sx={{
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color={theme.palette.grey[200]}
          fontWeight={500}
        >
          {percentage}
        </Typography>
      </Box>
    </Box>
  );
};
