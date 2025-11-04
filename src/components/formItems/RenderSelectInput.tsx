import React from "react";
import StatusHandler from "../statusHandler/StatusHandler";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FormSelectInput } from "@/types/renderFormItem";

const RenderSelectInput = ({
  label,
  name,
  options,
  status = "success",
  refetch,
  error,
  inputProps,
}: FormSelectInput) => {
  return (
    <StatusHandler status={status} refetch={refetch}>
      <FormControl fullWidth>
        <InputLabel id="render-select-input">{label}</InputLabel>
        <Select
          labelId="render-select-input"
          // value={age}
          label={label}
          // onChange={handleChange}
          {...inputProps}
        >
          {options.map((option) => (
            <MenuItem href="123" key={String(option.value)}>
              {option.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </StatusHandler>
  );
};

export default RenderSelectInput;
