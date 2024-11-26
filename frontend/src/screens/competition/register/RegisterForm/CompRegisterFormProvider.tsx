import { useState } from "react";
import { FormState, initialState } from "./FormState";
import { MultiStepCompRegoFormContext } from "./hooks/useMultiStepCompRegoForm";

/**
 *
 * A provider component that manages and provides the form data state for a multi-step competition registration
 * form.
 *
 * The `CompRegisterFormProvider` uses React's `useState` hook to manage the form's data (`formData`)
 * and provides a method (`updateFormData`) to update it. This provider makes the form data and the update
 * function available to any child components that consume the `MultiStepCompRegoFormContext`.
 *
 * The provider manages the form's state using the `FormState` type and initializes it with `initialState`.
 * A helper function `updateFormData` is used to update the form data in a controlled way, ensuring that
 * any partial updates are merged with the current state.
 *
 *
 * @param {React.HTMLAttributes<HTMLDivElement>} props - The component's props, allowing HTML div attributes.
 * @returns {JSX.Element} The context provider wrapping the children components.
 */
export const CompRegisterFormProvider: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children }) => {
  const [formData, setFormData] = useState<FormState>(initialState);

  const updateFormData = (data: Partial<FormState>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <MultiStepCompRegoFormContext.Provider
      value={{ formData, setFormData: updateFormData }}
    >
      {children}
    </MultiStepCompRegoFormContext.Provider>
  );
};
