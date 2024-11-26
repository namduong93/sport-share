import { FC, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../ResponsiveButton";
import {
  StyledCancelButton,
  StyledConfirmButton,
  StyledPopUpContent,
  StyledPopUpOverlay,
  StyledQuestion,
  StyledTimeoutConfirmButton,
} from "./ActionButton";

export const StyledResponsiveActionDiv = styled.div<{ $actionType: "primary" | "secondary" | "error" | "confirm"; }>`
  border-radius: 10px;
  box-sizing: border-box;
  height: 35px;
  border: none;
  white-space: nowrap;
  max-width: 150px;
  width: 100%;

  background-color: ${({ $actionType: actionType, theme }) => {
    if (actionType === "primary") {
      return theme.colours.primaryLight;
    } else if (actionType === "secondary") {
      return theme.colours.secondaryLight;
    } else if (actionType === "confirm") {
      return theme.colours.confirm;
    } else {
      return theme.colours.error;
    }
  }};

  color: ${({ $actionType: actionType, theme }) => {
    if (actionType === "error") {
      return theme.background;
    } else {
      return theme.fonts.colour;
    }
  }};

  font-weight: ${({ $actionType: actionType, theme }) => {
    if (actionType === "error") {
      return theme.fonts.fontWeights.bold;
    }
  }};
`;

interface ResponsiveActionButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  label: string;
  question: string;
  redirectPath?: string;
  timeout?: number;
  actionType: "primary" | "secondary" | "error" | "confirm";
  handleClick?: () => void;
  handleSubmit?: () => Promise<boolean>;
  handleClose?: () => void;
}

/**
 * A React button component that triggers an action, with a confirmation pop-up.
 * The button style is determined by the `actionType` prop, which can be one of `primary`,
 * `secondary`, `error`, or `confirm`.
 *
 * @param {ProgressBarProps} props - React ProgressBarProps specified above
 * @returns {JSX.Element} - Web page styled button which triggers a confirmation popup on click.
 */
export const ResponsiveActionButton: FC<ResponsiveActionButtonProps> = ({
  question,
  redirectPath,
  actionType,
  handleClick,
  timeout,
  handleClose = () => {},
  icon,
  label,
  style,
  handleSubmit,
  children,
  ...props
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (handleSubmit) {
      if (!(await handleSubmit())) {
        setIsOpen(false);
        return;
      }
    }
    if (redirectPath) {
      navigate(redirectPath);
    } else {
      setIsOpen(false);
    }
  };

  // Displays a Confirmation Pop-Up once the button is clicked
  const handleButtonClick = () => {
    if (handleClick) {
      handleClick();
    }
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    handleClose();
    setIsOpen(false);
  };

  return (
    <>
      <StyledResponsiveActionDiv className="responsive-action-button--StyledResponsiveActionDiv-0" $actionType={actionType} style={style}>
        <TransparentResponsiveButton
          actionType={actionType}
          onClick={handleButtonClick}
          isOpen={isOpen}
          icon={icon}
          label={label}
          {...props}
        />
      </StyledResponsiveActionDiv>
      {isOpen && (
        <StyledPopUpOverlay className="responsive-action-button--StyledPopUpOverlay-0" onClick={handleClosePopup}>
          <StyledPopUpContent className="responsive-action-button--StyledPopUpContent-0" onClick={(e) => e.stopPropagation()}>
            <StyledQuestion className="responsive-action-button--StyledQuestion-0">{question}</StyledQuestion>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {children}
            </div>
            {!timeout ? (
              <StyledConfirmButton className="responsive-action-button--StyledConfirmButton-0"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleConfirm}
              >
                Confirm
              </StyledConfirmButton>
            ) : (
              <StyledTimeoutConfirmButton className="responsive-action-button--StyledTimeoutConfirmButton-0"
                onMouseDown={(e) => e.preventDefault()}
                bgColor={theme.colours.confirm}
                seconds={timeout}
                onClick={handleConfirm}
              >
                Confirm
              </StyledTimeoutConfirmButton>
            )}
            <StyledCancelButton className="responsive-action-button--StyledCancelButton-0"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClosePopup}
            >
              Cancel
            </StyledCancelButton>
          </StyledPopUpContent>
        </StyledPopUpOverlay>
      )}
    </>
  );
};
