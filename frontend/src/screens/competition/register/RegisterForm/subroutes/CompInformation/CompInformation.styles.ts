import { styled } from "styled-components";

export const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.fonts.colour};
  padding: 0 20px;
`;

export const StyledContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 700px;
  width: 100%;
  min-width: 200px;
  padding: 0 15px;
`;

export const StyledTitle = styled.h1`
  margin-bottom: 20px;
  font-size: clamp(24px, 4vw, 32px);
  margin-top: 30px;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: clamp(20px, 5vw, 90px);
  flex-wrap: wrap;
`;

export const StyledButton = styled.button<{ $disabled?: boolean }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ $disabled: disabled, theme }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  pointer-events: ${({ $disabled: disabled }) => (disabled ? "none" : "auto")};
  cursor: ${({ $disabled: disabled }) =>
    disabled ? "not-allowed" : "pointer"};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const StyledGameDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 16px;
  width: 100%;  
  min-height: min-content;  
  margin: 24px 0;  
  flex: none;
  order: 0;
  flex-grow: 0;

  @media (max-width: 480px) {
    gap: 12px;
    padding: 0 10px;
  }
`;

export const StyledBoxPlayerContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  width: 736px;
  height: 35px;
  background: #FFFFFF;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  flex: none;
  order: 0;
  margin: 5px 0px;
  flex-grow: 0;

  @media (max-width: 480px) {
    padding: 15px;
    flex-direction: column;
    gap: 10px;
    height: auto;
  }
`;

export const StyledBoxNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 23px;

  width: 571px;
  height: 30px;

  flex: none;
  order: 0;
  flex-grow: 0;
   @media (max-width: 480px) {
    justify-content: center;
    gap: 15px;
  }
`;

export const StyledPlayerStatus = styled.div<{ $status?: 'going' | 'maybe' | 'notgoing' }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 4px;
  gap: 10px;
  width: 125px;
  height: 35px;
  background: ${({ $status }) => {
    switch ($status) {
      case 'going':
        return '#8BDFA5';
      case 'maybe':
        return '#FDD386';
      case 'notgoing':
        return '#F48385';
      default:
        return '#FF8252';
    }
  }};
  border-radius: 10px;
  flex: none;
  order: 0;
  flex-grow: 0;

  @media (max-width: 480px) {
    width: 100%;
    max-width: 125px;
  }
`;