import {
  Box,
  Card as CardBase,
  CardContent,
  CardHeader as CardHeaderBase,
  CardProps,
  Grid,
  IconButton,
  IconButtonProps,
  Stack,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import CloseIcon from "../assets/close-icon.svg?react";
import InfoIcon from "../assets/info-icon.svg?react";
import LoadingIcon from "../assets/loading-icon.svg?react";
import { FadeGrow } from "./animation/FadeGrow";
import { LayoutGroup } from "framer-motion";

const CloseBtn = (props: IconButtonProps) => {
  const theme = useTheme();

  return (
    <IconButton
      disableRipple={true}
      size="small"
      sx={{ stroke: theme.palette.grey[200] }}
      data-testid="closeCard"
      {...props}
    >
      <CloseIcon />
    </IconButton>
  );
};

const Title = ({ title, info }: { title: string; info?: string }) => {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <span>{title}</span>
      {info && (
        <Tooltip title={info} placement="top">
          <Box
            sx={{ display: "flex", "&:hover": { cursor: "pointer" } }}
            data-testid="info"
          >
            <InfoIcon />
          </Box>
        </Tooltip>
      )}
    </Stack>
  );
};

export const Card = ({
  loading,
  children,
  title,
  info,
  onClose,
}: CardProps & {
  loading?: boolean;
  title: string;
  info?: string;
  onClose: { (): void };
}) => {
  const theme = useTheme();

  const CardHeader = styled(CardHeaderBase)({
    padding: "8px 8px 8px 16px",
    backgroundColor: theme.palette.grey[700],
    ".MuiCardHeader-title": {
      fontSize: "13px",
      fontWeight: 500,
      color: theme.palette.grey[200],
    },
  });

  return (
    <FadeGrow layoutId="card">
      <CardBase variant="outlined">
        <CardHeader
          title={<Title title={title} info={info} />}
          action={<CloseBtn onClick={onClose} disabled={loading} />}
        ></CardHeader>
        <CardContent>
          <LayoutGroup>
            {loading ? (
              <FadeGrow layoutId="loader">
                <Grid container justifyContent="center">
                  <Grid item>
                    <span data-testid="loader">
                      <LoadingIcon />
                    </span>
                  </Grid>
                </Grid>
              </FadeGrow>
            ) : (
              <FadeGrow layoutId="content">{children}</FadeGrow>
            )}
          </LayoutGroup>
        </CardContent>
      </CardBase>
    </FadeGrow>
  );
};
