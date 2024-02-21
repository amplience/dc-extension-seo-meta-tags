import type { ButtonProps } from "@mui/material";
import InsightsIcon from "../assets/insights-icon.svg?react";
import { ToggleButton } from "./ToggleButton";
import { isEmptyString } from "ramda-adjunct";
import { useContext, useState } from "react";
import { ContentFieldExtensionContext } from "../hooks/ContentFieldExtensionContext";

export const InsightsButton = ({
  selected,
  onSelect,
  ...props
}: ButtonProps & {
  selected: boolean;
  onSelect: { (s: string | null): void };
}) => {
  const { sdk } = useContext(ContentFieldExtensionContext);
  const [disabled, setDisabled] = useState(true);

  sdk?.field
    .getValue()
    .then((value) => setDisabled(isEmptyString(value as string)));

  const handleClick = () => onSelect(selected ? null : "insights");

  return (
    <ToggleButton
      tooltip="SEO scoring & insights"
      size="small"
      value="insights"
      onClick={handleClick}
      selected={selected}
      disabled={disabled}
      {...props}
    >
      <InsightsIcon />
    </ToggleButton>
  );
};
