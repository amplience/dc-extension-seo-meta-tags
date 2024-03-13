import InsightsIcon from "../assets/insights-icon.svg?react";
import { ToggleButton } from "./ToggleButton";
import { isEmptyString } from "ramda-adjunct";
import { useContext, useState } from "react";
import { ContentFieldExtensionContext } from "../hooks/ContentFieldExtensionContext";
import { isNil } from "ramda";
import { getParams } from "../lib";
import { ContentFieldExtension } from "dc-extensions-sdk";

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
  const { sdk } = useContext(
    ContentFieldExtensionContext
  ) as ContentFieldExtensionContext & { sdk: ContentFieldExtension };
  const [noTitle, setNoTitle] = useState(true);

  const extensionType = getParams(sdk).type;

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
      data-id={`seo-insights-${extensionType}`}
      {...props}
    >
      <InsightsIcon />
    </ToggleButton>
  );
};
