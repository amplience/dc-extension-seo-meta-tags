import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  useTheme,
} from "@mui/material";
import { isEmpty } from "ramda";
import { useState } from "react";
import { withValue } from "../../lib";
import { motion } from "framer-motion";

const TitleOption = (title: string) => (
  <FormControlLabel
    key={title}
    value={title}
    control={
      <Radio
        size="small"
        sx={{
          padding: "5px 10px",
        }}
      />
    }
    label={title}
  />
);

export const TitleOptions = ({
  options,
  onTitleSelected,
  onCancel,
}: {
  options: string[];
  onTitleSelected: { (s: string): void };
  onCancel: { (): void };
}) => {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState<string>("");

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <Grid container direction="column" color={theme.palette.grey[200]}>
        <Grid item>
          <RadioGroup
            onChange={withValue(setSelectedValue)}
            value={selectedValue}
          >
            {options.map(TitleOption)}
          </RadioGroup>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={2} marginTop={2}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isEmpty(selectedValue)}
              onClick={() => onTitleSelected(selectedValue)}
            >
              Select
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </motion.div>
  );
};
