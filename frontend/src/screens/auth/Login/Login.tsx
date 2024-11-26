import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../../utility/request";
import { StyledFlexBackground } from "../../../components/general_utility/Background";
import {
  StyledForgotPassword,
  StyledFormContainer,
  StyledImage,
  StyledInputContainer,
  StyledSignUpLink,
  StyledTitle,
} from "./Login.styles";
import TextInput from "../../../components/general_utility/TextInput";
import { StyledCustomButton } from "../../general_styles/button_styles";

/**
 * A React web page component that renders a login form. It includes fields for email and password
 * and handles the submission of the form to authenticate the user. Upon successful login, the user is
 * redirected to the dashboard. The component also provides a link to navigate to a password recovery
 * page and a sign-up page for new users.
 *
 * @returns {JSX.Element} - A login form with email, password fields, and links for forgot password
 *                         and sign-up functionality.
 */
export const Login: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // If the user logs in successfully, redirect them to their dashboard
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendRequest.post("/users/authenticate", { email, password });
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      console.error("Login failed", error);
    }
  };

  return (
    <StyledFlexBackground
      style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}
      className="login--StyledFlexBackground-0">
      <div style={{ width: '600px', flex: '0 1 auto' }}>
        <StyledImage
          src={`../resource/assets/sport_landing.png`}
          className="login--StyledImage-0" />
      </div>
      <StyledFormContainer onSubmit={handleSubmit} className="login--StyledFormContainer-0">
        <StyledTitle className="login--StyledTitle-0">Sport Share</StyledTitle>
        <StyledInputContainer className="login--StyledInputContainer-0">
          <TextInput
            label="Email"
            placeholder="email@example.com"
            type="email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="97%"
          />
        </StyledInputContainer>
        <StyledInputContainer className="login--StyledInputContainer-1">
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width="97%"
          />
        </StyledInputContainer>
        <StyledForgotPassword
          onClick={() => navigate('/password/recovery/email')}
          className="login--StyledForgotPassword-0">Forgot Password?</StyledForgotPassword>
        <StyledCustomButton type="submit" className="login--StyledCustomButton-0">Sign in</StyledCustomButton>
        <div>
          <span style={{ marginRight: '5px', fontFamily: 'Arial, Helvetica, sans-serif' }}>Are you new?</span>
          <StyledSignUpLink
            onClick={() => navigate('/roleregistration')}
            className="login--StyledSignUpLink-0">Sign Up</StyledSignUpLink>
        </div>
      </StyledFormContainer>
    </StyledFlexBackground>
  );
};
