import { SelectProps } from "@mui/material";
import { QueryStatus } from "@tanstack/react-query";
import { SelectHTMLAttributes } from "react";
import { DatePickerProps, Multiple, Range } from "react-multi-date-picker";

type DefaultFieldValue = Record<string, string>;

type FormInputType = "text" | "autocomplete" | "checkbox" | "select" | "date" | "password" | "custom";

interface FormBaseInput<T = DefaultFieldValue> {
  label: string;
  name: keyof T;
  labelProps?: React.ComponentProps<"label">;
  error?: string;
}

// type TOption = MenuItemProps | { title: any; value: any };

interface FormTextFieldInput<T = DefaultFieldValue> extends FormBaseInput<T> {
  inputType: "text";
  inputProps?: React.ComponentProps<"input">;
}

type SelectOption = {
  value: string | number | boolean;
  title: React.ReactNode;
};

interface FormSelectInput<T = DefaultFieldValue> extends FormBaseInput<T> {
  inputType: "select";
  inputProps?: SelectProps;
  options: SelectOption[];
  status?: QueryStatus;
  refetch?: () => void;
}

// interface IAutocomplete<T = FieldValues> extends IBaseInput<T> {
//   inputType: "autocomplete";
//   elementProps?: AutocompleteProps<
//     T,
//     Multiple,
//     DisableClearable,
//     FreeSolo,
//     ChipComponent
//   >;
//   options: TOption[];
//   status?: QueryStatus;
//   refetch?: () => void;
// }
// interface ICheckbox<T = FieldValues> extends IBaseInput<T> {
//   inputType: "checkbox";
//   elementProps?: CheckboxProps;
// }

interface IDate<T = DefaultFieldValue> extends FormBaseInput<T> {
  inputType: "date";
  inputProps?: Partial<DatePickerProps<Multiple, Range>>;
  value: Date | undefined;
  onChange: (value: Date | null) => void;
}
// interface ICustomInput<T = DefaultFieldValue> extends FormBaseInput<T> {
//   inputType: "custom";
//   render: React.ReactElement;
// }

type FormFieldInput<T = DefaultFieldValue> = FormTextFieldInput<T> | FormSelectInput<T>;
// | IDate<T>
// | ICustomInput<T>;

// type IRenderFormInput<T = FieldValue> = IRenderInput<T> & {
//   errors: FieldErrors<T>;
//   control: any;
//   // control: ControllerRenderProps<FieldValues, string>;
//   setValue?: UseFormSetValue<T>;
//   gridProps?: Grid2Props;
// };
