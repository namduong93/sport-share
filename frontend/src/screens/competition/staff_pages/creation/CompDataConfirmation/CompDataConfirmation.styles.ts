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
`

export const StyledTitle = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`;

export const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 18px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  width: 100%;
`;

export const StyledHalfText = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.regular};
  width: 45%;
`

export const StyledDoubleInputContainer = styled.div<{ margin?: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
  margin-bottom: ${({ margin }) => (margin ? "20px" : "0")};
`

export const StyledText = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 20px;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  width: 100%;
`


export const StyledLocationList = styled.div`
  display: grid;
  width: 60%;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 20px;
  gap: 10px;
`;

export const StyledLocationItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center; 
  font-style: ${({ theme }) => theme.fonts.style};
  margin-top: 20px;
  margin-bottom: 20px;
`;


export const StyledButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
`;

export const StyledButton = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  min-width: 80px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const StyledAsterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;
