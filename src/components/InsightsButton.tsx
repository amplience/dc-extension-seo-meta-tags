import InsightsIcon from "../assets/insights-icon.svg?react";
import { ToggleButton } from "./ToggleButton";
import { isEmptyString } from "ramda-adjunct";
import { useContext, useState } from "react";
import { ContentFieldExtensionContext } from "../hooks/ContentFieldExtensionContext";
import { isNil } from "ramda";

export const InsightsButton = ({
  selected,
  onSelect,
  disabled,
  ...props
}: unknown & {
  disabled?: boolean;
  selected: boolean;
  onSelect: { (s: "insights" | null): void };
}) => {
  const { sdk } = useContext(ContentFieldExtensionContext);
  const [noTitle, setNoTitle] = useState(true);

  sdk?.field
    .getValue()
    .then((value) =>
      setNoTitle(isNil(value) || isEmptyString(value as string))
    );

  const handleClick = () => onSelect(selected ? null : "insights");

  return (
    <ToggleButton
      tooltip="SEO scoring & insights"
      size="small"
      value="insights"
      onClick={handleClick}
      selected={selected}
      disabled={disabled || noTitle}
      data-testid="insightsBtn"
      {...props}
    >
      <InsightsIcon />
    </ToggleButton>
  );
};
