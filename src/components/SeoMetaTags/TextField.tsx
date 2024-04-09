import {
  TextField as BaseTextField,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import { withValue } from "../../lib";
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExtensionContext } from "../../hooks/ExtensionContext";
import { validate } from "./validate";

export const TextField = ({
  disabled,
  placeholder,
  value,
  onChange,
}: {
  disabled: boolean;
  placeholder: string;
  value: string;
  onChange: { (s: string): void };
}) => {
  const { sdk, readOnly } = useContext(ExtensionContext);
  const theme = useTheme();
  const [validation, setValidation] = useState<{
    invalid: boolean;
    message: string;
  }>({ invalid: false, message: "" });
  const [fieldValue, setFieldValue] = useState("");

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  const fieldUpdated = (value: string) => {
    const validation = validate(sdk!, value);

    setFieldValue(value);

    if (validation.success) {
      setValidation({
        invalid: false,
        message: "",
      });
      onChange(value);
    } else {
      setValidation({
        invalid: true,
        message: validation.message,
      });
    }
  };

  return (
    <div>
      <BaseTextField
        error={validation.invalid}
        fullWidth
        onChange={withValue(fieldUpdated)}
        placeholder={placeholder}
        value={fieldValue}
        variant="standard"
        disabled={disabled || readOnly}
        inputProps={{
          sx: {
            color: theme.palette.grey[200],
            "&::placeholder": {
              color: theme.palette.grey[600],
              opacity: 1,
            },
          },
        }}
      />
      <Box sx={{ height: "20px" }}>
        {validation.invalid && (
          <AnimatePresence>
            <motion.div
              key="message"
              initial={{ opacity: 0, translateY: "-16px" }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: "-16px" }}
            >
              <Typography
                variant="subtitle"
                sx={{ color: theme.palette.error.main }}
              >
                {validation.message}
              </Typography>
            </motion.div>
          </AnimatePresence>
        )}
      </Box>
    </div>
  );
};
