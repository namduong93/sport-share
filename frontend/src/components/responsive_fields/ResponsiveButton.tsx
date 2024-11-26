import { FC, ReactNode } from "react";
import styled from "styled-components";

export const StyledSortButton = styled.button<{ $isSortOpen: boolean }>`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.filterText};
  color: ${({ theme }) => theme.colours.filterText};
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;

  ${({ $isSortOpen: isSortOpen, theme }) =>
    isSortOpen &&
    `
    background-color: ${theme.colours.sidebarBackground};
    color: ${theme.fonts.colour};
  `}

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;

interface ResponsiveButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean;
  icon: ReactNode;
  label: string;
}

/**
 * A React button component for responsive layouts
 *
 * @param {ResponsiveButtonProps} props - React ResponsiveButtonProps specified above
 * @returns {JSX.Element} - Web page styled responsive button.
 */
export const ResponsiveButton: FC<ResponsiveButtonProps> = ({
  onClick,
  icon,
  label,
  style,
  isOpen = false,
  ...props
}) => {
  return (
    <StyledSortButton
      onClick={onClick}
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        padding: "0",
        display: "flex",
        flexWrap: "wrap",
        ...style,
      }}
      $isSortOpen={isOpen}
      {...props}
      className="responsive-button--StyledSortButton-0" >
      <div
        style={{
          display: "flex",
          alignContent: "start",
          flexWrap: "wrap",
          height: "50%",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div style={{ height: "200%" }}>{icon}</div>
        <span>{label}</span>
      </div>
    </StyledSortButton>
  );
};

export const StyledTransparentButton = styled.button<{ $isSortOpen: boolean, $actionType: "primary" | "secondary" | "confirm" | "error"}>`
  background-color: transparent;
  border-radius: 10px;
  box-sizing: border-box;
  border: 0px;
  min-width: 31px;
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: ${({ theme }) => theme.fonts.colour};

  &:hover {
    cursor: pointer;
    background-color: ${({ $actionType: actionType, theme }) => {
      if (actionType === "primary") {
        return theme.colours.primaryDark;
      } else if (actionType === "secondary") {
        return theme.colours.secondaryDark;
      } else if (actionType === "confirm") {
        return theme.colours.confirmDark;
      } else {
        return theme.colours.cancelDark;
      }
    }} !important;
    color: ${({ theme }) => theme.background};
  }
`;

interface ResponsiveActionButtonProps extends ResponsiveButtonProps {
  actionType: "primary" | "secondary" | "confirm" | "error";
}

/**
 * A React button component variant
 *
 * @param {ResponsiveActionButtonProps} props - React ResponsiveActionButtonProps specified above
 * @returns {JSX.Element} - Web page styled transparent button with transparent background, hover,
 * and action-specific styles
 */
export const TransparentResponsiveButton: FC<ResponsiveActionButtonProps> = ({
  onClick,
  actionType,
  icon,
  label,
  style,
  isOpen = false,
  ...props
}) => {

  return (
    <StyledTransparentButton
      $actionType={actionType}
      onClick={onClick}
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        padding: "0",
        display: "flex",
        flexWrap: "wrap",
        ...style,
      }}
      $isSortOpen={isOpen}
      className="responsive-button--StyledTransparentButton-0"
      {...props}
    >
      <div
        style={{
          display: "flex",
          alignContent: "start",
          flexWrap: "wrap",
          height: "50%",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div style={{ height: "200%" }}>{icon}</div>
        <span style={{ marginLeft: "5px" }}>{label}</span>
      </div>
    </StyledTransparentButton>
  );
};
