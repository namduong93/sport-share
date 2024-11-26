import { FC, useState, FormEvent } from "react";
import styled from "styled-components";
import { sendRequest } from "../../../utility/request";
import TextInputLight from "../../../components/general_utility/TextInputLight";

const StyledButton = styled.button`
  border-radius: 10px;
  padding: 10px;
  border: none;
  white-space: nowrap;
  max-width: 150px;
  width: 100%;

  background-color: ${({ theme }) => theme.colours.confirm};

  color: ${({ theme }) => theme.fonts.colour};

  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.confirmDark};
    color: ${({ theme }) => theme.background};
  }
`;

const StyledWarningMessage = styled.p<{ $isSuccess: boolean }>`
  color: ${({ $isSuccess: isSuccess, theme }) =>
    isSuccess ? theme.colours.confirm : theme.colours.error};
  font-size: 14px;
  margin-top: 10px;
`;

interface UpdatePasswordProps {
  isOpen: boolean;
};

/**
 * A React component that allows users to update their password.
 *
 * The `UpdatePassword` component provides a form where users can enter their current password, new password,
 * and confirm the new password. It validates that the new password matches the confirmation and then makes
 * an API request to update the password. The component also shows success or error messages based on the outcome
 * of the password update attempt.
 *
 * @param {UpdatePasswordProps} props - React UpdatePasswordProps as specified above
 * @returns {JSX.Element} - A UI component that renders a form for updating the user's password and displays
 * success or error messages.
 */
export const UpdatePassword: FC<UpdatePasswordProps> = ({ isOpen }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const clearFields = () => {
    setCurrentPassword("");
    setConfirmPassword("");
    setNewPassword("");
  };

  const handleSubmitPassword = async (e: FormEvent) => {
    e.preventDefault();
    console.log(
      `current: ${currentPassword}, new: ${newPassword}, confirm: ${confirmPassword}`
    );

    if (newPassword !== confirmPassword) {
      setWarningMessage("Passwords do not match.");
      setIsSuccess(false);
    } else {
      try {
        await sendRequest.put("/user/password", {
          oldPassword: currentPassword,
          newPassword: newPassword,
        });
        setWarningMessage("Password updated successfully!");
        setIsSuccess(true);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          console.log("Error updating password: ", error);
        });
        setIsSuccess(false);
        setWarningMessage("Failed to update password.");
      }
    }
    clearFields();
  };

  return isOpen && (
    <div>
      <form onSubmit={handleSubmitPassword} className="update-password--form-0">
        <div>
          <TextInputLight
            label="Current Password"
            type="password"
            name="current"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required={true}
          />
        </div>
        <div>
          <TextInputLight
            label="New Password"
            type="password"
            name="new"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required={true}
          />
        </div>
        <div>
          <TextInputLight
            label="Confirm New Password"
            type="password"
            name="confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={true}
          />
        </div>
        <StyledButton type="submit" className="update-password--StyledButton-0">Update Password</StyledButton>
      </form>

      {warningMessage && <StyledWarningMessage
        $isSuccess={isSuccess}
        className="update-password--StyledWarningMessage-0">{warningMessage}</StyledWarningMessage>}
    </div>
  );
};
