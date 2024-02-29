import PreviewIcon from "../assets/preview-icon.svg?react";
import { ToggleButton } from "./ToggleButton";
import { useContext, useState } from "react";
import { ContentFieldExtensionContext } from "../hooks/ContentFieldExtensionContext";
import { getParams, isEmptyString } from "../lib";
import { ContentFieldExtension } from "dc-extensions-sdk";

export const PreviewButton = ({
  selected,
  onSelect,
  ...props
}: unknown & {
  selected: boolean;
  onSelect: { (s: string | null): void };
}) => {
  const { sdk } = useContext(
    ContentFieldExtensionContext
  ) as ContentFieldExtensionContext & { sdk: ContentFieldExtension };
  const [disabled, setDisabled] = useState(true);

  const extensionType = getParams(sdk).type;

  sdk?.field
    .getValue()
    .then((value) => setDisabled(isEmptyString(value as string)));

  const handleClick = () => onSelect(selected ? null : "preview");

  return (
    <ToggleButton
      tooltip="SERP Preview"
      size="small"
      value="preview"
      onClick={handleClick}
      selected={selected}
      disabled={disabled}
      data-id={`seo-preview-${extensionType}`}
      {...props}
    >
      <PreviewIcon />
    </ToggleButton>
  );
};
