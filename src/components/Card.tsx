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
import { motion } from "framer-motion";

const CloseBtn = (props: IconButtonProps) => {
  const theme = useTheme();

  return (
    <IconButton
      disableRipple={true}
      size="small"
      sx={{ stroke: theme.palette.grey[200] }}
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
          <Box sx={{ display: "flex", "&:hover": { cursor: "pointer" } }}>
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
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <CardBase variant="outlined">
        <CardHeader
          title={<Title title={title} info={info} />}
          action={<CloseBtn onClick={onClose} disabled={loading} />}
        ></CardHeader>
        <CardContent>
          {loading ? (
            <Grid container justifyContent="center">
              <Grid item>
                <LoadingIcon />
              </Grid>
            </Grid>
          ) : (
            children
          )}
        </CardContent>
      </CardBase>
    </motion.div>
  );
};
