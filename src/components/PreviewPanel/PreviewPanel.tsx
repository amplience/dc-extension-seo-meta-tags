import { Grid, Stack, Typography } from "@mui/material";
import { Card } from "../Card";
import MenuIcon from "../../assets/menu-icon.svg?react";
import WebPreviewIcon from "../../assets/web-preview-icon.svg?react";
import MobilePreviewIcon from "../../assets/mobile-preview-icon.svg?react";
import WorldIcon from "../../assets/world-icon.png";
import { useContext, useEffect, useState } from "react";
import { ExtensionContext } from "../../hooks/ExtensionContext";
import { getParams } from "../../lib";
import { ToggleButton } from "../ToggleButton";
import { evolve, ifElse, pipe, take, trim, when } from "ramda";
import { concatRight, isNilOrEmpty, lengthGt } from "ramda-adjunct";
import { LayoutGroup } from "framer-motion";
import { Fade } from "../animation/Fade";

type View = "desktop" | "mobile";

const info = `This preview is an example of what your meta data may look like when populated in Google search.

Google recommends a maximum title length of up to 60 characters and a maximum description length of 160.`;

const defaultTitle =
  "Page title to outline the page's content (up to 60 chars)";
const defaultDescription =
  "A page's meta description tag is meant to give the user an idea of the content that exists within the page. (up to 160 chars)";

export const PreviewSelector = ({
  selected,
  onSelect,
}: {
  selected: View;
  onSelect: { (v: View): void };
}) => {
  const selectView = (view: View) => () => onSelect(view);

  return (
    <Stack direction="row" gap={1}>
      <ToggleButton
        value="desktop"
        data-testid="desktop"
        onClick={selectView("desktop")}
        tooltip="Desktop View"
        sx={{ background: "white" }}
        selected={selected === "desktop"}
      >
        <WebPreviewIcon />
      </ToggleButton>
      <ToggleButton
        value="mobile"
        data-testid="mobile"
        onClick={selectView("mobile")}
        tooltip="Mobile View"
        sx={{ background: "white" }}
        selected={selected === "mobile"}
      >
        <MobilePreviewIcon />
      </ToggleButton>
    </Stack>
  );
};

const titleStyles = {
  color: "#1A0DAB",
  fontSize: "20px",
  fontWeight: 400,
  lineHeight: "26px",
  margin: "0 0 5px",
};

const previewStyles = {
  color: "#202124",
  fontSize: "14px",
  fontFamily: "Arial",
};

const truncate = (numChars: number) =>
  when(
    lengthGt(numChars),
    pipe(take(numChars) as (s: string) => string, trim, concatRight("…"))
  );

export const PreviewPanel = ({
  value,
  onClose,
}: {
  value: string;
  onClose: { (): void };
}) => {
  const { sdk, seoValues } = useContext(ExtensionContext);
  const [view, setView] = useState<View>("desktop");
  const [preview, setPreview] = useState({
    title: defaultTitle,
    description: defaultDescription,
  });

  useEffect(() => {
    const { type } = getParams(sdk!);
    const updatedPreview = evolve(
      {
        title: ifElse(isNilOrEmpty, () => defaultTitle, truncate(60)),
        description: ifElse(
          isNilOrEmpty,
          () => defaultDescription,
          truncate(160)
        ),
      },
      {
        ...seoValues,
        [type]: value,
      }
    );

    setPreview(updatedPreview);
  }, [sdk, value, seoValues]);

  return (
    <Card
      title="Web Preview"
      info={info}
      onClose={onClose}
      action={<PreviewSelector selected={view} onSelect={setView} />}
    >
      <LayoutGroup>
        {view === "desktop" && (
          <Fade layoutId="desktop">
            <Grid container flexDirection="column" sx={previewStyles}>
              <Grid item>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  example.com <MenuIcon />
                </div>
              </Grid>
              <Grid item maxWidth="100%">
                <div style={{ overflow: "auto", marginBottom: "4px" }}>
                  <div style={{ width: "600px" }}>
                    <h2 style={titleStyles} data-testid="desktopTitle">
                      {preview.title}
                    </h2>
                    <p
                      style={{
                        color: "#545454",
                        margin: "0 0 12px",
                        lineHeight: "22px",
                      }}
                    >
                      {preview.description}
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item textAlign="center" width="100%">
                <Typography
                  variant="subtitle"
                  sx={{
                    "@media (min-width: 682px)": { display: "none" },
                  }}
                >
                  Scroll to see full preview (Google previews have a fixed width
                  of 600px)
                </Typography>
              </Grid>
            </Grid>
          </Fade>
        )}
        {view === "mobile" && (
          <Fade layoutId="mobile">
            <Grid
              container
              flexDirection="column"
              sx={{
                borderRadius: "10px",
                boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.28)",
                padding: "20px",
                maxWidth: "408px",
                ...previewStyles,
              }}
            >
              <Grid item>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <img src={WorldIcon} alt="" />
                  example.com
                </div>
              </Grid>
              <Grid item>
                <h2 style={titleStyles} data-testid="mobileTitle">
                  {preview.title}
                </h2>
                <p
                  style={{
                    color: "#545454",
                    margin: 0,
                    lineHeight: "22px",
                  }}
                >
                  {preview.description}
                </p>
              </Grid>
            </Grid>
          </Fade>
        )}
      </LayoutGroup>
    </Card>
  );
};
