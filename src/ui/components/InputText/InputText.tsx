import React, { FunctionComponent } from "react";

import $ from "./InputText.module.css";

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  placeholder: string;
}

const InputText: FunctionComponent<InputTextProps> = ({
  name,
  placeholder,
  ...rest
}) => {
  return (
    <input
      aria-label={name}
      className={$.inputText}
      name={name}
      placeholder={placeholder}
      type="text"
      {...rest}
    />
  );
};

export default InputText;
