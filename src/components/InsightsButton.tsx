import InsightsIcon from "../assets/insights-icon.svg?react";
import { ToggleButton } from "./ToggleButton";
import { isEmptyString } from "ramda-adjunct";
import { useContext, useState } from "react";
import { ContentFieldExtensionContext } from "../hooks/ContentFieldExtensionContext";
import { isNil } from "ramda";
import { getParams } from "../lib";

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
  const [noValue, setNoValue] = useState(true);

  const extensionType = getParams(sdk!).type;

  sdk!.field
    .getValue()
    .then((value) => setNoValue(isNil(value) || isEmptyString(value)));

  const handleClick = () => onSelect(selected ? null : "insights");

  return (
    <ToggleButton
      tooltip="SEO scoring & insights"
      value="insights"
      onClick={handleClick}
      selected={selected}
      disabled={disabled || noValue}
      data-testid="insightsBtn"
      data-id={`seo-insights-${extensionType}`}
      {...props}
    >
      <InsightsIcon />
    </ToggleButton>
  );
};
