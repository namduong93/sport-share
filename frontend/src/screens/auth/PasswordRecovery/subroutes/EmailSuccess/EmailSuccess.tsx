import { FC } from "react";
import { StyledFormContainer } from "../../PasswordRecovery.styles";
import { TimeoutButton } from "../../../../../components/general_utility/TimeoutButton";

/**
 * A React web page component that displays a confirmation message indicating that a password
 * recovery email has been sent. It also provides a "Resend Email" button for users to request another
 * recovery email, though the functionality is currently a placeholder.
 *
 * @param {React.HTMLAttributes<HTMLFormElement>} props - Allows standard HTML form attributes.
 * @param {React.CSSProperties} style - Optional inline styles applied to the form container.
 * @returns {JSX.Element} - A styled confirmation message with an optional resend button.
 */
export const EmailSuccess: FC<React.HTMLAttributes<HTMLFormElement>> = ({
  style,
  ...props
}) => {
  // Handles the Resend Email functionality - current empty as email system is not implemented
  const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  return (
    <StyledFormContainer
      style={{ justifyContent: 'center', ...style }}
      {...props}
      className="email-success--StyledFormContainer-0">
      <div style={{
        fontSize: '24px',
      }}>An email has been sent to your address with password recovery steps</div>
      <TimeoutButton onClick={handleResend} >Resend Email</TimeoutButton>
    </StyledFormContainer>
  );
}
