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
import { FadeGrow } from "../animation/FadeGrow";

const TitleOption = (title: string) => (
  <FormControlLabel
    key={title}
    value={title}
    sx={{
      marginBottom: "4px",
      alignItems: "start",
    }}
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
  onSelected,
  onCancel,
  onChange,
}: {
  options: string[];
  onSelected: { (s: string): void };
  onCancel: { (): void };
  onChange: { (s: string): void };
}) => {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState<string>("");

  const optionSelected = (option: string) => {
    setSelectedValue(option);
    onChange(option);
  };

  return (
    <FadeGrow layoutId="options">
      <Grid container direction="column" color={theme.palette.grey[200]}>
        <Grid item>
          <RadioGroup
            onChange={withValue(optionSelected)}
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
              onClick={() => onSelected(selectedValue)}
            >
              Select
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </FadeGrow>
  );
};
