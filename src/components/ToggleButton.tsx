import {
  Tooltip,
  ToggleButton as ToggleBase,
  ToggleButtonProps,
} from "@mui/material";
import { styled, useTheme } from "@mui/material";

export const ToggleButton = ({
  tooltip,
  disabled,
  ...props
}: ToggleButtonProps & {
  tooltip: string;
  disabled: boolean;
}) => {
  const theme = useTheme();
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

  return disabled ? (
    <ToggleButton size="small" disabled={true} {...props}></ToggleButton>
  ) : (
    <Tooltip title={tooltip} placement="bottom">
      <ToggleButton size="small" {...props}></ToggleButton>
    </Tooltip>
  );
};
