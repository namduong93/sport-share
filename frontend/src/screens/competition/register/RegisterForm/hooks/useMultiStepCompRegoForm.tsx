import { createContext, useContext } from "react";
import { FormState } from "../FormState";

/**
 * Creates a context and custom hook for managing the state of a multi-step competition registration form.
 *
 * The `MultiStepRegoFormContext` holds the form data (`formData`) and a function to update the
 * form data (`setFormData`). The `useMultiStepCompRegoForm` custom hook provides a way to access
 * and modify the form state from any component within the provider's tree.
 *
 * @returns {MultiStepCompRegoFormContextType} - The current form state (`formData`) and the
 * function to update it (`setFormData`).
 */
interface MultiStepCompRegoFormContextType {
  formData: FormState;
  setFormData: (data: Partial<FormState>) => void;
}

export const MultiStepCompRegoFormContext = createContext<
  MultiStepCompRegoFormContextType | undefined
>(undefined);

export const useMultiStepCompRegoForm = () => {
  const context = useContext(MultiStepCompRegoFormContext);
  if (!context) {
    throw new Error(
      "useMultiStepForm must be used within a MultiStepFormProvider"
    );
  }
  return context;
};
