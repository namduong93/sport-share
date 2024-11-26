import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiStepRegoForm } from "../../hooks/useMultiStepRegoForm";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import { RegoProgressBar } from "../../../../../components/progress_bar/ProgressBar";
import {
  StyledButton,
  StyledButtonContainer,
  StyledContainer,
  StyledContentContainer,
  StyledDoubleInputContainer,
  StyledTitle,
} from "./AccountDataInput.styles";
import TextInput from "../../../../../components/general_utility/TextInput";
import DropdownInput from "../../../../../components/general_utility/DropDownInput";
import { StyledErrorMessage } from "../../../../general_styles/error_styles";
import { genderOptions } from "./AccountDataOptions";

/**
 * A React web page form component for collecting account information in a multi-step registration process.
 *
 * The `AccountDataInput` component renders input fields for the user to enter personal information,
 * including first name, last name, preferred name, gender, pronouns, email, password, and confirm password.
 * It also handles validation, showing error messages if passwords do not match, and tracks the form data
 * using a multi-step registration context.
 *
 * @returns {JSX.Element} - The form UI for the account data input in the registration process.
 */
export const AccountDataInput: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const isButtonDisabled = () => {
    const { firstName, lastName, password, email } = formData;
    return (
      error !== "" ||
      password === "" ||
      confirmPassword === "" ||
      firstName === "" ||
      lastName === "" ||
      email === ""    
    );
  };

  // Verifies that the Password and Confirm Password entries are the same
  // displaying an error if they are not
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== formData.password) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  const handleNext = () => {
    navigate("/siteinformation");
  };

  return (
    <StyledFlexBackground
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontFamily: 'Arial, Helvetica, sans-serif' }}
      className="account-data-input--StyledFlexBackground-0">
      <RegoProgressBar progressNumber={1} />
      <StyledContainer className="account-data-input--StyledContainer-0">
        <StyledContentContainer className="account-data-input--StyledContentContainer-0">
          <StyledTitle className="account-data-input--StyledTitle-0">Account Information</StyledTitle>
          <StyledDoubleInputContainer className="account-data-input--StyledDoubleInputContainer-0">
            <TextInput
              label="First Name"
              placeholder="Nam"
              type="text"
              required={true}
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              width="45%"
            />
            <TextInput
              label="Last Name"
              placeholder="Duong"
              type="text"
              required={true}
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              width="45%"
            />
          </StyledDoubleInputContainer>
          <TextInput
            label="Preferred Name"
            placeholder="Please Enter"
            type="text"
            required={false}
            value={formData.preferredName || ""}
            onChange={(e) =>
              setFormData({ ...formData, preferredName: e.target.value })
            }
            width="100%"
          />
          <TextInput
            label="Email"
            placeholder="user@example.com"
            type="text"
            required={true}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            width="100%"
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            required={true}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            width="100%"
          />
          <TextInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            type="password"
            required={true}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            width="100%"
          />
          {error && <StyledErrorMessage className="account-data-input--StyledErrorMessage-0">{error}</StyledErrorMessage>}
          <StyledButtonContainer className="account-data-input--StyledButtonContainer-0">
            <StyledButton
              onClick={() => navigate('/roleregistration')}
              className="account-data-input--StyledButton-0">Back</StyledButton>
            <StyledButton
              $disabled={isButtonDisabled()}
              onClick={handleNext}
              className="account-data-input--StyledButton-1">Next</StyledButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};
