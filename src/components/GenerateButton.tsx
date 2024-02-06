import { Button, ButtonProps } from "@mui/material";

export const GenerateButton = (props: ButtonProps) => {
  const generateValue = () => {};

  return (
    <Button onClick={generateValue} variant="outlined" {...props}>
      Generate
    </Button>
  );
};
