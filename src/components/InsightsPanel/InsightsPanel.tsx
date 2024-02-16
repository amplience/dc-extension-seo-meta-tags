import { Card, CardHeader, IconButton } from "@mui/material";
import CloseIcon from "../../assets/close-icon.svg?react";

const CloseBtn = () => {
  return (
    <IconButton>
      <CloseIcon />
    </IconButton>
  );
};

export const InisghtsPanel = () => {
  return (
    <Card>
      <CardHeader
        title="SEO Scoring & Insights"
        action={<CloseBtn />}
      ></CardHeader>
    </Card>
  );
};
