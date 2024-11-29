import { styled } from "styled-components";

export const StyledContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-width: 200px;
`;

export const StyledTitle = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
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

export const StyledFormLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  width: 100%;
`;

export const StyledAsterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
  margin-left: 5px; // Add space between label and asterisk
`;

export const StyledText = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 20px;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  width: 100%;
  font-weight: normal; 
`;

export const StyledDoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
`;

export const StyledColon = styled.span`
  align-self: center;
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
`;

export const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
  width: 100%;
`;