import { TextField, TextFieldProps } from "@mui/material";

export type SeoFieldProps = TextFieldProps & {
  schema?: any;
  value: string;
  inactive?: boolean;
  loading?: boolean;
};

export const SeoField = (props: SeoFieldProps) => {
  const { schema = {}, value, loading = false, ...fieldProps } = props;

  return (
    <div style={{ display: "flex", flexDirection: "column", marginLeft: 2 }}>
      <TextField
        variant="standard"
        disabled={loading || props.disabled}
        value={value}
        {...fieldProps}
      />
    </div>
  );
};
