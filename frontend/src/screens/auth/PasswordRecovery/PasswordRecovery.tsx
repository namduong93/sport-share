import { FC, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
  StyledCenteredFormBackground,
  StyledFormContainer,
} from "./PasswordRecovery.styles";
import TextInput from "../../../components/general_utility/TextInput";
import { StyledErrorMessage } from "../../general_styles/error_styles";
import { StyledCustomButton } from "../../general_styles/button_styles";

/**
 * PasswordCodeRecoverForm Component
 *
 * This component provides a user interface for entering a new password and verifying it
 * using a password recovery code.
 *
 * @param {React.HTMLAttributes<HTMLFormElement>} props - Standard HTML form attributes for customization.
 * @param {React.CSSProperties} style - Optional inline styles applied to the form container.
 * @returns {JSX.Element} - A styled form with input fields for a new password and password confirmation.
 */
export const PasswordCodeRecoverForm: FC<
  React.HTMLAttributes<HTMLFormElement>
> = ({ style, ...props }) => {
  const { code } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Sends the password reset code to backed - currently empty as email system is not
  // implemented
  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      navigate("/");
    } catch (error: unknown) {
      console.log("Error resetting password: ", error);
    }
  };

  // Ensures that the new password matches the password re-entry
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  };

  return (
    <StyledFormContainer
      onSubmit={handleCodeSubmit}
      style={style}
      {...props}
      className="password-recovery--StyledFormContainer-0">
      <h1>Verification Code</h1>
      <div style={{ width: '68%' }}>
        <h2 style={{ color: 'red' }}>DEV: code = {code}</h2>
      </div>
      <div style={{ width: '68%' }}>
        <TextInput
          label="New Password"
          placeholder="Enter your password"
          type="password"
          required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          width="100%"
        />
      </div>
      <div style={{ width: '68%' }}>
        <TextInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          type="password"
          required={true}
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleConfirmPasswordChange(e.target.value)
          }
          width="100%"
        />
      </div>
      {error && <StyledErrorMessage className="password-recovery--StyledErrorMessage-0">{error}</StyledErrorMessage>}
      <div style={{ width: '68%', display: 'flex', justifyContent: 'space-around' }}>
        <StyledCustomButton
          style={{ minWidth: '80px' }}
          className="password-recovery--StyledCustomButton-0">Change Password</StyledCustomButton>
      </div>
    </StyledFormContainer>
  );
}


/**
 * A React web page component that is the container for the password recovery process. It displays a
 * header image and renders nested routes using `Outlet` for the specific recovery steps.
 *
 * @returns {JSX.Element} - A styled container with a logo and child components.
 */
export const PasswordRecovery: FC = () => {
  return (
    <StyledCenteredFormBackground className="password-recovery--StyledCenteredFormBackground-0">
      <div style={{ width: '600px', flex: '0 1 auto' }}>
        <img
          style={{ width: '100%' }}
          src="https://sppcontests.org/wp-content/uploads/2024/02/RGB_SPCPA_Logo_24@4x-2.png"
          className="password-recovery--img-0" />
      </div>
      <Outlet/>
    </StyledCenteredFormBackground>
  );
}
