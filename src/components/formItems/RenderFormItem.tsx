import React from "react";
import RenderTextInput from "./RenderTextInput";
import RenderSelectInput from "./RenderSelectInput";
import { FormFieldInput } from "@/types/renderFormItem";

const RenderFormItem = (props: FormFieldInput) => {
  switch (props.inputType) {
    case "text":
      return <RenderTextInput {...props} />;
    case "select":
      return <RenderSelectInput {...props} />;
    // case "date":
    //   return <CustomDatePicker {...props} />;
  }

  return <span>unsupported input type</span>;
};

export default RenderFormItem;
