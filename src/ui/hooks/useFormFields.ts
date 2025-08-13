import React from "react";

interface FormFields {
  [key: string]: string;
}

interface UseFormFieldsReturn {
  fields: FormFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setField: (name: string, value: string) => void;
  clearFields: () => void;
  clearField: (name: string) => void;
}

export default function useFormFields(initialFields: FormFields = {}): UseFormFieldsReturn {
  const [fields, setFields] = React.useState<FormFields>(initialFields);

  const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev: FormFields) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const setField = React.useCallback((name: string, value: string) => {
    setFields((prev: FormFields) => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const clearFields = React.useCallback(() => {
    setFields(initialFields);
  }, [initialFields]);

  const clearField = React.useCallback((name: string) => {
    setFields((prev: FormFields) => ({
      ...prev,
      [name]: initialFields[name] || ''
    }));
  }, [initialFields]);

  return {
    fields,
    onChange,
    setField,
    clearFields,
    clearField
  };
}
