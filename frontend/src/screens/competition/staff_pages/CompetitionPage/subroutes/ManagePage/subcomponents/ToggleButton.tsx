import React from "react";
import styled from "styled-components";

const StyledToggleContainer = styled.div<{ $isOn: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 42px;
  height: 22px;
  background-color: ${({ $isOn, theme }) =>
    $isOn ? theme.colours.primaryLight : theme.colours.userInfoCardHeader};
  border-radius: 15px;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

const StyledToggleCircle = styled.div<{ $isOn: boolean }>`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transform: ${({ $isOn }) => ($isOn ? "translateX(20px)" : "translateX(0)")};
  transition: transform 0.3s;
`;

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
};

/**
 * A React toggle component that allows switching between an 'on' and 'off' state
 *
 * @param {ToggleButtonProps} props - React ToggleButtonProps specified above
 * @returns {JSX.Element} - Web page styled toggle component.
 */
export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isOn,
  onToggle,
}) => {
  return (
    <StyledToggleContainer
      $isOn={isOn}
      onClick={onToggle}
      className="toggle-button--StyledToggleContainer-0">
      <StyledToggleCircle $isOn={isOn} className="toggle-button--StyledToggleCircle-0" />
    </StyledToggleContainer>
  );
};
