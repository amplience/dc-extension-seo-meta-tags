import { CssBaseline } from "@mui/material";
import "@fontsource/ibm-plex-sans/300.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";

import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
} from "@mui/material/styles";
import { ReactElement } from "react";

declare module "@mui/material/styles" {
  interface PaletteColor {
    icon?: string;
  }

  interface SimplePaletteColorOptions {
    icon?: string;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    title: true;
    subtitle: true;
    error: true;
    link: true;
  }
}

const theme = extendTheme({
  typography: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    caption: {
      fontSize: 11,
    },
  },
  colorSchemes: {
    light: {
      palette: {
        text: {
          primary: "#808080",
        },
        primary: {
          main: "#039BE5",
          icon: "#F88B8B",
        },
        grey: {
          100: "#1a222d",
          200: "#333",
          300: "#c9cccf",
          400: "#CCCCCC",
          500: "#E5E5E5",
          600: "#666",
          700: "#f4f4f5",
          800: "#bfbfbf",
        },
        error: {
          main: "#FF3366",
          light: "rgba(255, 51, 102, 0.03)",
        },
        success: { main: "#66CC00", light: "rgba(0, 255, 71, 0.03)" },
      },
    },
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: "title" },
          style: ({ theme }) => ({
            fontSize: "13px",
            color: theme.palette.grey[200],
          }),
        },
        {
          props: { variant: "subtitle" },
          style: ({ theme }) => ({
            fontSize: "12px",
            color: theme.palette.grey[600],
          }),
        },
        {
          props: { variant: "error" },
          style: ({ theme }) => ({
            fontSize: "11px",
            color: theme.palette.error.main,
          }),
        },
        {
          props: { variant: "link" },
          style: ({ theme }) => ({
            fontSize: "11px",
            color: theme.palette.primary.main,
          }),
        },
      ],
    },

    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontSize: "14px",
          height: "32px",
          boxShadow: "none",
          "&:disabled": {
            color: theme.vars.palette.grey[400],
            backgroundColor: theme.vars.palette.grey[500],
            borderColor: theme.vars.palette.grey[500],
          },
          "&:hover": {
            color: "#FFF",
            backgroundColor: theme.vars.palette.primary.main,
            boxShadow: "none",
          },
        }),
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: theme.vars.palette.grey[100],
          fontSize: theme.typography.fontSize,
          fontWeight: 500,
          lineHeight: "14px",
          padding: "6px 12px",
          whiteSpace: "pre-line",
          maxWidth: "410px",
        }),
        arrow: ({ theme }) => ({
          color: theme.vars.palette.grey[100],
        }),
      },
    },

    MuiInput: {
      styleOverrides: {
        underline: {
          "&:after": {
            transition: "unset",
          },
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: "13px",
          "&$error": {
            color: undefined,
          },
          "&$focused": {
            color: undefined,
          },
        },
      },
    },
  },
});

function Theme({ children }: { children: ReactElement }) {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
}

export default Theme;
