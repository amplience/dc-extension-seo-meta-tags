import "./keywords.css";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { Key, useContext, useEffect, useState } from "react";
import CloseIcon from "../../assets/close-icon.svg?react";
import {
  MuiChipsInput,
  MuiChipsInputChipComponent,
  MuiChipsInputChipProps,
} from "mui-chips-input";
import { ExtensionContext } from "../../hooks/ExtensionContext";
import { AnimatePresence } from "framer-motion";
import { Fade } from "../animation/Fade";
import { FadeGrow } from "../animation/FadeGrow";
import { getPlaceholder } from "./getPlaceholder";
import { isEmpty, pipe, split, reject, trim, map } from "ramda";

const Chip = (
  Component: MuiChipsInputChipComponent,
  key: Key,
  props: MuiChipsInputChipProps
) => (
  <Component
    key={key}
    sx={{
      borderRadius: "4px",
      background: "#f4f4f5",
      color: "#333",
      fontSize: "12px",
      height: "24px",
      margin: 0,
    }}
    deleteIcon={<CloseIcon style={{ stroke: "#333", width: "14px" }} />}
    {...props}
  />
);

export const KeywordsField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: { (v: string): void };
}) => {
  const { sdk } = useContext(ExtensionContext);
  const theme = useTheme();
  const [keywords, setKeywords] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const hasInput = input.length > 0;
  const hasKeywords = keywords.length > 0;
  const placeholder = hasKeywords ? "" : getPlaceholder(sdk!);

  useEffect(() => {
    const splitKeywords = pipe(split(","), map(trim), reject(isEmpty));
    setKeywords(splitKeywords(value));
  }, [value]);

  const addKeyword = () => {
    const updatedKeywords = [...keywords, input];
    setKeywords(updatedKeywords);
    onChange(updatedKeywords.join(", "));
  };

  const keywordsChanged = (keywords: string[]) => {
    setKeywords(keywords);
    onChange(keywords.join(", "));
  };

  const clearKeywords = () => {
    setKeywords([]);
    onChange("");
  };

  return (
    <>
      <div style={{ position: "relative" }} data-testid="keywords">
        <MuiChipsInput
          value={keywords}
          onChange={keywordsChanged}
          onInputChange={setInput}
          variant="standard"
          clearInputOnBlur
          disableEdition
          hideClearAll
          placeholder={placeholder}
          sx={{
            width: "100%",
            ".MuiInputBase-root": { padding: "0 26px 5px 0", gap: "8px" },
            "& input": {
              width: "0 !important",
            },
          }}
          size="small"
          renderChip={Chip}
        />
        <AnimatePresence>
          {hasKeywords && (
            <Fade layoutId="clear">
              <Tooltip placement="bottom" title="Clear all">
                <IconButton
                  sx={{
                    stroke: theme.palette.grey[200],
                    position: "absolute",
                    right: "-5px",
                    top: "50%",
                    translate: "0 -17px",
                  }}
                  size="small"
                  disableRipple
                  data-testid="clearAll"
                  onClick={clearKeywords}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Fade>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {hasInput && (
          <FadeGrow layoutId="addBtn">
            <button
              onClick={addKeyword}
              data-testid="addBtn"
              className="addBtn"
              style={{
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                background: "white",
                border: "none",
                padding: 0,
                minWidth: "175px",
                marginBottom: "10px",
                marginRight: "3px",
                textAlign: "left",
              }}
            >
              <div style={{ padding: "16px" }}>
                <h2
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: theme.palette.grey[600],
                    margin: "0 0 8px",
                  }}
                >
                  Create keyword:
                </h2>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {input}
                </span>
              </div>
              <div
                style={{
                  backgroundColor: theme.palette.grey[700],
                  fontSize: "12px",
                  fontWeight: 500,
                  padding: "8px 16px",
                }}
              >
                Press{" "}
                <span
                  style={{
                    background: "white",
                    border: `1px solid ${theme.palette.grey[400]}`,
                    borderRadius: "4px",
                    padding: "2px 8px",
                    fontWeight: 400,
                  }}
                >
                  Enter
                </span>{" "}
                to add
              </div>
            </button>
          </FadeGrow>
        )}
      </AnimatePresence>
    </>
  );
};
