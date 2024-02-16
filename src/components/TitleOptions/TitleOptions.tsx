import {
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import { isEmpty } from "ramda";
import { useState } from "react";
import { withValue } from "../../lib";

const TitleOption = (title: string) => (
  <FormControlLabel
    value={title}
    control={<Radio size="small" />}
    label={title}
  />
);

export const TitleOptions = ({
  options,
  onTitleSelected,
}: {
  options: string[];
  onTitleSelected: { (s: string): void };
}) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  return (
    <Grid container direction="column">
      <Grid item>
        <RadioGroup
          onChange={withValue(setSelectedValue)}
          value={selectedValue}
        >
          {options.map(TitleOption)}
        </RadioGroup>
      </Grid>
      <Grid item spacing={2}>
        <Grid container columnGap={2}>
          <Button variant="outlined">Cancel</Button>
          <Button
            variant="contained"
            disabled={isEmpty(selectedValue)}
            onClick={() => onTitleSelected(selectedValue)}
          >
            Select
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
