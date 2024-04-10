import PreviewIcon from "../assets/preview-icon.svg?react";
import { ToggleButton } from "./ToggleButton";
import { useContext, useState } from "react";
import { ExtensionContext } from "../hooks/ExtensionContext";
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
  const { sdk } = useContext(ExtensionContext);
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
      tooltip="Google Web Preview"
      size="small"
      value="preview"
      onClick={handleClick}
      selected={selected}
      disabled={disabled || noValue}
      data-testid="previewBtn"
      data-id={`seo-preview-${extensionType}`}
      {...props}
    >
      <PreviewIcon />
    </ToggleButton>
  );
};
