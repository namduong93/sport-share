import { styled } from "styled-components";

export const StyledCompCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  max-width: 285px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out !important;
  box-sizing: border-box;

  &:hover {
    transform: translate(3px, 3px);
  }
`;

export const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledCardTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledCompHeader = styled.div`
  text-align: left;

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonts.fontSizes.large};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;

export const StyledCardMiddle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledCardText = styled.div`
  color: ${({ theme }) => theme.fonts.colour};
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
`;

export const StyledCardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

export const StyledRoleContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
`;

export const StyledRole = styled.div`
  background-color: ${({ theme }) => theme.colours.primaryDark};
  color: ${({ theme }) => theme.background};
  border: none;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 8px 10px;
  width: fit-content;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
`;

export const StyledCountdown = styled.div`
  color: ${({ theme }) => theme.colours.primaryDark};
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
`;

export const StyledProgressBar = styled.div`
  background-color: ${({ theme }) => theme.colours.primaryLight};
  border-radius: 20px;
  height: 15px;
  overflow: hidden;
  margin-top: 20px;
  box-sizing: border-box;
`;

export const StyledProgress = styled.div<{ $width: number }>`
  background-color: ${({ theme }) => theme.colours.primaryDark};
  height: 100%;
  width: ${({ $width: width }) => `${width}%`};
`;
