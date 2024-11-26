import { createContext, useContext } from "react";
import { FormState } from "../FormState";

interface MultiStepRegoFormContextType {
  formData: FormState;
  setFormData: (data: Partial<FormState>) => void;
}

export const MultiStepRegoFormContext = createContext<
  MultiStepRegoFormContextType | undefined
>(undefined);

/**
 * Creates a context and custom hook for managing the state of a multi-step registration form.
 *
 * The `MultiStepRegoFormContext` holds the form data (`formData`) and a function to update the
 * form data (`setFormData`). The `useMultiStepRegoForm` custom hook provides a way to access
 * and modify the form state from any component within the provider's tree.
 *
 * @returns {MultiStepRegoFormContextType} - The current form state (`formData`) and the
 * function to update it (`setFormData`).
 */

export const useMultiStepRegoForm = () => {
  const context = useContext(MultiStepRegoFormContext);
  if (!context) {
    throw new Error(
      "useMultiStepForm must be used within a MultiStepFormProvider"
    );
  }
  return context;
};
