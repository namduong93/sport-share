import { FC, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { RadioOption } from "../../TeamCard";
import {
  StyledApprovalNameDiv,
  StyledRadioCheckIcon,
  StyledRadioCrossIcon,
  StyledRadioIconDiv,
} from "../../TeamCard.styles";

interface ApprovalNameRadiosProps extends React.HTMLAttributes<HTMLDivElement> {
  setTeamIds: React.Dispatch<React.SetStateAction<Array<number>>>;
  setRejectedTeamIds: React.Dispatch<React.SetStateAction<Array<number>>>;
  teamId: number;
};

/**
 * A React component that displays radio buttons for approving or rejecting a team.
 *
 * The `ApproveNameRadios` component provides interactive radio buttons that allow users to approve
 * or reject a team. It uses two radio icons, and updates the respective team list based on the selected option.
 *
 * @param {ApprovalNameRadiosProps} props - React ApprovalNameRadiosProps as specified above
 * @returns {JSX.Element} - A set of radio buttons (check and cross) for approving or rejecting a team.
 */

export const ApproveNameRadios: FC<ApprovalNameRadiosProps> = ({
  setTeamIds,
  setRejectedTeamIds,
  teamId,
  ...props
}) => {
  const theme = useTheme();

  const [selectedOption, setSelectedOption] = useState<RadioOption>(
    RadioOption.Neither
  );

  // Toggles the check option state between selected and unselected
  const handleCheckClick = () => {
    setSelectedOption((prev) =>
      prev === RadioOption.Check ? RadioOption.Neither : RadioOption.Check
    );
  };

  // Toggles the cross option state between selected and unselected
  const handleCrossClick = () => {
    setSelectedOption((prev) =>
      prev === RadioOption.Cross ? RadioOption.Neither : RadioOption.Cross
    );
  };

  // Adds the team ID to the list of approved teams
  const addTeam = () => {
    setTeamIds((prev) => (prev.includes(teamId) ? prev : [...prev, teamId]));
  };

  // Removes the team ID from the list of approved teams
  const removeTeam = () => {
    setTeamIds((prev) => {
      const index = prev.indexOf(teamId);
      if (index < 0) {
        return prev;
      }

      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  const rejectTeam = () => {
    setRejectedTeamIds((prev) =>
      prev.includes(teamId) ? prev : [...prev, teamId]
    );
  };

  const unRejectTeam = () => {
    setRejectedTeamIds((prev) => {
      const index = prev.indexOf(teamId);
      if (index < 0) {
        return prev;
      }

      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  };

  // Updates the approved and rejected team lists based on the selected radio option
  useEffect(() => {
    if (selectedOption === RadioOption.Check) {
      addTeam();
      unRejectTeam();
    } else {
      removeTeam();
    }

    if (selectedOption === RadioOption.Cross) {
      rejectTeam();
    }
  }, [selectedOption]);

  return (
    <StyledApprovalNameDiv {...props} className="approve-name-radios--StyledApprovalNameDiv-0">
      <StyledRadioIconDiv
        onClick={handleCheckClick}
        style={{
          border: `1px solid ${theme.colours.confirm}`,
          backgroundColor: selectedOption === RadioOption.Check ? theme.colours.confirm : theme.background
        }}
        className="approve-name-radios--StyledRadioIconDiv-0">
        <StyledRadioCheckIcon
          style={{
            color: selectedOption === RadioOption.Check ? theme.background : theme.colours.confirm
          }}
          className="approve-name-radios--StyledRadioCheckIcon-0" />
      </StyledRadioIconDiv>
      <div style={{ flex: '0 2 20px' }} />
      <StyledRadioIconDiv
        onClick={handleCrossClick}
        style={{
          border: `1px solid ${theme.colours.cancel}`,
          backgroundColor: selectedOption === RadioOption.Cross ? theme.colours.cancel : theme.background,
          color: selectedOption === RadioOption.Cross ? theme.background : theme.colours.cancel
        }}
        className="approve-name-radios--StyledRadioIconDiv-1">
        <StyledRadioCrossIcon
          style={{
            color: selectedOption === RadioOption.Cross ? theme.background : theme.colours.cancel
          }}
          className="approve-name-radios--StyledRadioCrossIcon-0" />
      </StyledRadioIconDiv>
    </StyledApprovalNameDiv>
  );
}
