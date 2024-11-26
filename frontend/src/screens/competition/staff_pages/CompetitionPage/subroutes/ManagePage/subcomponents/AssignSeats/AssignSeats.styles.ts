import { styled } from "styled-components";
import { TransparentResponsiveButton } from "../../../../../../../../components/responsive_fields/ResponsiveButton";

export const StyledManageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100%;
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const StyledTitle = styled.h1`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colours.primaryDark};
`

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

export const StyledInputSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const StyledSeatCount = styled.span`
  font-size: 1em;
  font-weight: bold;
  color: ${({ theme }) => theme.colours.secondaryDark};
  align-self: center;
  justify-self: center;
  flex: 1;
`;

export const StyledTeamCount = styled(StyledSeatCount)<{ $level: string }>`
  color: ${({ theme, $level: level }) => level === "Level A" ? theme.teamView.levelA : theme.teamView.levelB};
`;

export const StyledRoomList = styled.div`
  display: grid;
  width: 80%;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 15px;
  margin-top: 20px;
`;

export const StyledRoomItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledButton = styled.button`
  width: 120px;
  height: 35px;
  background-color: ${({ theme }) => theme.colours.confirm};
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  align-self: center;

  &:disabled {
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    cursor: not-allowed;
  }
`;

export const StyledDeleteIcon = styled.span`
  cursor: pointer;
  font-size: 1rem;
  color: ${({ theme }) => theme.colours.error};

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

export const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

export const StyledSeatInputSelect = styled.div`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 10px;
  margin-top: 10px;
`;

export const StyledAssignSeatsButton = styled(TransparentResponsiveButton)<{ $disabled: boolean }>`
  background-color: ${({ theme, $disabled: disabled }) => disabled ? theme.colours.sidebarBackground : theme.colours.secondaryLight};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ $disabled: disabled }) => disabled ? "not-allowed" : "pointer"}; 
  flex: 1;
  height: 50px;

  &:hover {
    cursor: ${({ $disabled: disabled }) => disabled ? "not-allowed" : "pointer"}; 
    /* background-color: ${({ theme, $disabled: disabled }) => disabled ? theme.colours.sidebarBackground : theme.colours.secondaryDark}; */
    color: ${({ theme, $disabled: disabled }) => disabled ? theme.fonts.colour : theme.background};
    background-color: blue;
  }
`;

export const StyledDistributeSeats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 110px;
`;

export const StyledModalOverlay = styled.div`
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

export const StyledModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  width: 100%;
  height: 30%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  box-sizing: border-box;
`;

export const StyledDownloadButton = styled(TransparentResponsiveButton)`
  background-color: ${({ theme }) => theme.colours.primaryLight};
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledNotifyButton = styled(TransparentResponsiveButton)`
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 80%;
  max-height: 90px;
  gap: 10px;
  margin-left: 10%;
  box-sizing: border-box;
`;

export const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colours.error};
  display: flex;
  align-self: flex-end;

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

export const StyledLevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const StyledLevels = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  gap: 5%;
`;

export const StyledCloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const StyledInputTitleA = styled.div`
  font-size: 1rem;
  background-color: ${({ theme }) => theme.staffActions.contactBorder};
  color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: fit-content;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const StyledInputTitleB = styled.div`
  font-size: 1rem;
  background-color: ${({ theme }) => theme.staffActions.seatBorder};
  color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: fit-content;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const StyledAssignPopupText = styled.h2`
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledAlert = styled.div`
  color: ${({ theme }) => theme.colours.error};
`;