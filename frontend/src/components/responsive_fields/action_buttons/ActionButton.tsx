import React, { FC, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { TimeoutButton } from "../../general_utility/TimeoutButton";

const StyledButton = styled.button<{ $actionType: "primary" | "secondary" | "error" }>`
  border-radius: 10px;
  padding: 10px;
  border: none;
  white-space: nowrap;
  max-width: 150px;
  width: 100%;

  background-color: ${({ $actionType: actionType, theme }) => {
    if (actionType === "primary") {
      return theme.colours.primaryLight;
    } else if (actionType === "secondary") {
      return theme.colours.secondaryLight;
    } else {
      return theme.colours.error;
    }
  }};

  color: ${({ $actionType: actionType, theme }) => {
    if (actionType === "error") {
      return theme.background;
    } else {
      return theme.fonts.colour;
    };
  }};

  font-weight: ${({ $actionType: actionType, theme }) => {
    if (actionType === "error") {
      return theme.fonts.fontWeights.bold;
    };
  }};

  &:hover {
    cursor: pointer;
    background-color: ${({ $actionType: actionType, theme }) => {
      if (actionType === "primary") {
        return theme.colours.primaryDark;
      } else if (actionType === "secondary") {
        return theme.colours.secondaryDark;
      } else {
        return theme.colours.cancelDark;
      }
    }};
    color: ${({ theme }) => theme.background};
    font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  };
`;

export const StyledPopUpOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const StyledPopUpContent = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 20px;
  width: 98%;
  max-width: 320px;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

export const StyledQuestion = styled.div`
  padding: 20px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledConfirmButton = styled.button`
  background-color: ${({ theme }) => theme.colours.confirm};
  color: ${({ theme }) => theme.fonts.colour};
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  margin: 15px;
  max-width: 150px;
  min-width: 100px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.confirmDark};
    color: ${({ theme }) => theme.background};
  }
`;

export const StyledTimeoutConfirmButton = styled(TimeoutButton)`
  color: ${({ theme }) => theme.fonts.colour};
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  margin: 15px;
  max-width: 150px;
  min-width: 100px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.confirmDark};
    color: ${({ theme }) => theme.background};
  }
`;

export const StyledCancelButton = styled.button`
  background-color: ${({ theme }) => theme.colours.cancel};
  color: ${({ theme }) => theme.fonts.colour};
  padding: 10px 15px;
  border-radius: 20px;
  border: none;
  margin: 15px;
  max-width: 150px;
  min-width: 100px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.cancelDark};
    color: ${({ theme }) => theme.background};
  }
`;

interface ActionButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  actionName: string;
  question: string;
  redirectPath: string;
  actionType: "primary" | "secondary" | "error";
  handleClick?: () => void;
};

/**
 * A React A button component that triggers an action on the website, such as navigating to a
 * different path or displaying a confirmation pop-up.
 * The button's style and behavior depend on the action type (`primary`, `secondary`, `error`).
 *
 * @param {ActionButtonProps} props - React ActionButtonProps specified above
 * @returns {JSX.Element} - Web page button component showing an optional confirmation pop-up upon click
 */
export const ActionButton: FC<ActionButtonProps> = ({
  actionName,
  question,
  redirectPath,
  actionType,
  handleClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate(redirectPath);
  };

  const handleButtonClick = () => {
    if (handleClick) {
      handleClick();
    } else {
      setIsOpen(true);
    }
  };

  return <>
    <StyledButton
      $actionType={actionType}
      onClick={handleButtonClick}
      className="action-button--StyledButton-0">
      {actionName}
    </StyledButton>
    {isOpen && (
      <StyledPopUpOverlay
        onClick={() => setIsOpen(false)}
        className="action-button--StyledPopUpOverlay-0">
        <StyledPopUpContent
          onClick={(e) => e.stopPropagation()}
          className="action-button--StyledPopUpContent-0">
          <StyledQuestion className="action-button--StyledQuestion-0">{question}</StyledQuestion>
          <StyledConfirmButton
            onClick={handleConfirm}
            className="action-button--StyledConfirmButton-0">Confirm</StyledConfirmButton>
          <StyledCancelButton
            onClick={() => setIsOpen(false)}
            className="action-button--StyledCancelButton-0">Cancel</StyledCancelButton>
        </StyledPopUpContent>
      </StyledPopUpOverlay>
    )}
  </>;
};
