import { Typography, useTheme } from "@mui/material";

export const ErrorMessage = ({ error }: { error: string }) => {
  const theme = useTheme();

  return (
    <Typography variant="subtitle" color={theme.palette.error.main}>
      {error}
    </Typography>
  );
};
