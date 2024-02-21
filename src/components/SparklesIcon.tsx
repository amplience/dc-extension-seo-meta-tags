import { useContext } from "react";
import Icon from "../assets/sparkles-icon.svg?react";
import { useTheme } from "@mui/material";
import { ContentFieldExtensionContext } from "../hooks/ContentFieldExtensionContext";

export const SparklesIcon = () => {
  const theme = useTheme();
  const { readOnly, canGenerate } = useContext(ContentFieldExtensionContext);
  return (
    <Icon
      style={{
        color:
          readOnly || !canGenerate
            ? theme.palette.grey[500]
            : theme.palette.primary.icon,
        fontSize: "32px",
      }}
    />
  );
};
