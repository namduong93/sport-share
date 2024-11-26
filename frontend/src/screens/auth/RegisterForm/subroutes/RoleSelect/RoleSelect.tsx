import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiStepRegoForm } from "../../hooks/useMultiStepRegoForm";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import {
  StyledButton,
  StyledFormContainer,
  RoleContainer,
  StyledStaffButton,
  StyledStudentButton,
  StyledTitle,
} from "./RoleSelect.styles";

/**
 * A React web page form component for selecting the user's role during the registration process.
 *
 * The `RoleSelect` component allows the user to choose between "Student" or "Staff" roles.
 * Once a role is selected, the role is stored in the form data using the `useMultiStepRegoForm` context.
 *
 * @returns {JSX.Element} - A form UI for selecting a user role during registration.
 */
export const RoleSelect: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();

  const handleRoleClick = (selectedRole: "User" | "Admin") => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.role) {
      alert("Please select a role before proceeding");
      return;
    }
    navigate("/accountinformation");
  };

  return (
    <StyledFlexBackground
      style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      className="role-select--StyledFlexBackground-0">
      <StyledFormContainer onSubmit={handleSubmit} className="role-select--StyledFormContainer-0">
        <StyledTitle className="role-select--StyledTitle-0">What is your role?</StyledTitle>
        <RoleContainer>
          <StyledStudentButton
            type='button'
            // Pass isSelected prop
            isSelected={formData.role === 'User'}
            onClick={() => handleRoleClick('User')}
            className="role-select--StyledStudentButton-0">User</StyledStudentButton>

          <StyledStaffButton
            type='button'
            // Pass isSelected prop
            isSelected={formData.role === 'Admin'}
            onClick={() => handleRoleClick('Admin')}
            className="role-select--StyledStaffButton-0">Admin</StyledStaffButton>
        </RoleContainer>
        <StyledButton disabled={!formData.role} className="role-select--StyledButton-0">Next</StyledButton>
      </StyledFormContainer>
    </StyledFlexBackground>
  );
};
