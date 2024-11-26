import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledFormContainer } from "../../PasswordRecovery.styles";
import TextInput from "../../../../../components/general_utility/TextInput";
import { StyledCustomButton } from "../../../../general_styles/button_styles";

/**
 * A React web page compenent that displays a form for users to input their email address
 * to initiate the  password recovery process. It includes a text input for email and a submit button.
 *
 * @param {React.HTMLAttributes<HTMLFormElement>} props - Allows standard HTML form attributes.
 * @param {React.CSSProperties} style - Optional inline styles applied to the form container.
 * @returns {JSX.Element} - A styled email recovery form component.
 */
export const EmailForm: FC<React.HTMLAttributes<HTMLFormElement>> = ({
  style,
  ...props
}) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      navigate("/password/recovery/email/success");
    } catch (error: unknown) {
      console.log("Error recovering account: ", error);
    }
  };

  return (
    <StyledFormContainer
      onSubmit={handleEmailSubmit}
      style={style}
      {...props}
      className="email-form--StyledFormContainer-0">
      <h1>Recover Password</h1>
      <div style={{ width: "68%" }}>
        <TextInput
          label="Email"
          placeholder="email@example.com"
          type="email"
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          width="100%"
        />
      </div>
      <StyledCustomButton
        style={{ minWidth: '134px' }}
        className="email-form--StyledCustomButton-0">Get Recovery Code</StyledCustomButton>
    </StyledFormContainer>
  );
}
