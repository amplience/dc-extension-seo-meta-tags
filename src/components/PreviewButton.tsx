import PreviewIcon from "../assets/preview-icon.svg?react";
import { ToggleButton } from "./ToggleButton";
import { useContext, useState } from "react";
import { ContentFieldExtensionContext } from "../hooks/ContentFieldExtensionContext";
import { getParams, isEmptyString } from "../lib";
import { isNil } from "ramda";

export const PreviewButton = ({
  selected,
  disabled,
  onSelect,
  ...props
}: unknown & {
  disabled: boolean;
  selected: boolean;
  onSelect: { (s: "preview" | null): void };
}) => {
  const { sdk } = useContext(ContentFieldExtensionContext);
  const [noValue, setNoValue] = useState(true);

  const extensionType = getParams(sdk!).type;

  sdk!.field
    .getValue()
    .then((value) =>
      setNoValue(isNil(value) || isEmptyString(value as string))
    );

  const handleClick = () => onSelect(selected ? null : "preview");

  return (
    <ToggleButton
      tooltip="SERP Preview"
      size="small"
      value="preview"
      onClick={handleClick}
      selected={selected}
      disabled={disabled || noValue}
      data-id={`seo-preview-${extensionType}`}
      {...props}
    >
      <PreviewIcon />
    </ToggleButton>
  );
};
