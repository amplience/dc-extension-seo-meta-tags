import Icon from "../assets/sparkles-icon.svg?react";
import { useTheme } from "@mui/material";

export const SparklesIcon = (props: { inactive?: boolean }) => {
  const theme = useTheme();
  return (
    <Icon
      style={{
        color: props.inactive
          ? theme.palette.grey[500]
          : theme.palette.primary.icon,
        fontSize: "32px",
      }}
    />
  );
};
