import { FaTimes } from "react-icons/fa";
import { styled } from "styled-components";
import { StyledFlexBackground } from "../../components/general_utility/Background";

export const StyledOverflowFlexBackground = styled(StyledFlexBackground)`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

export const StyledDashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow-x: visible;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledAlertButton = styled.button`
  border-radius: 10px;
  padding: 0px;
  background-color: ${({ theme }) => theme.colours.notifLight};
  color: ${({ theme }) => theme.colours.notifDark};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.notifDark};
    color: ${({ theme }) => theme.colours.notifLight};
  }
`;

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

export const StyledFilterTagButton = styled.button`
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  cursor: auto;
  box-sizing: border-box;
`;

export const StyledRemoveFilterIcon = styled(FaTimes)`
  margin-left: 5px;
  color: ${({ theme }) => theme.fonts.colour};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

export const StyledContentArea = styled.div`
  margin-top: 32px;
  overflow-y: auto;
  overflow-x: auto;
  flex: 1;
  max-height: calc(100vh - 200px);
`;

export const StyledCompetitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(294px, 100%), 1fr));
  gap: 20px;
  width: 100%;
  min-height: 500px;
  box-sizing: border-box;
`;

export const StyledTitle2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
`;
