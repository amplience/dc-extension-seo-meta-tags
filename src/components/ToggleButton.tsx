import {
  Tooltip,
  ToggleButton as ToggleBase,
  ToggleButtonProps,
} from "@mui/material";
import { styled, useTheme } from "@mui/material";
import { useContext } from "react";
import { ContentFieldExtensionContext } from "../hooks/ContentFieldExtensionContext";

export const ToggleButton = ({
  tooltip,
  disabled,
  ...props
}: ToggleButtonProps & {
  tooltip: string;
  disabled: boolean;
}) => {
  const { canGenerate } = useContext(ContentFieldExtensionContext);
  const theme = useTheme();
  const isDisabled = disabled || !canGenerate;
  const ToggleButton = styled(ToggleBase)({
    width: "32px",
    height: "32px",
    stroke: "black",
    "&.Mui-selected, &.Mui-selected:hover": {
      color: "white",
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.light,
      stroke: "white",
    },
    "&:disabled": {
      color: theme.palette.grey[500],
      borderColor: theme.palette.grey[500],
      backgroundColor: theme.palette.grey[700],
      stroke: theme.palette.grey[800],
    },
  });

  return isDisabled ? (
    <ToggleButton size="small" disabled={true} {...props}></ToggleButton>
  ) : (
    <Tooltip title={tooltip} placement="bottom">
      <ToggleButton size="small" {...props}></ToggleButton>
    </Tooltip>
  );
};
