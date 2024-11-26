import { FaRegUser } from "react-icons/fa";
import { styled } from "styled-components";

export const StyledNarrowDisplayDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  row-gap: 20px;

  @media (min-width: 1001px) {
    display: none;
  }
`;


export const StyledWideDisplayDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export const StyledWideInfoContainerDiv = styled.div<{ $isHeader?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #D9D9D9;
  display: flex;
  font-size: 13px;
  gap: 0.5%;
  min-height: 54px;

  ${({ theme, $isHeader }) => !$isHeader && `&:hover {
    background-color: ${theme.colours.sidebarBackground};
  }

  & span {
    background-color: transparent;
  }`}
`;

export const StyledUserNameContainerDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const StyledUserNameGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 20% 80%;
`;

export const StyledUserIcon = styled(FaRegUser)`
  margin: auto 0 auto 25%;
`;

export const StyledUsernameTextSpan = styled.span`
  margin: auto 0 auto 5%;
`;

export const StyledSmallContainerDiv = styled.div`
  width: 5%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: normal;
`;

export const StyledEmailContainerDiv = styled.div<{ $isHeader: boolean }>`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  color: ${({ theme }) => theme.fonts.colour};
  ${({ $isHeader: isHeader }) => !isHeader &&
  `&:hover {
    overflow: visible;
    justify-content: center;
  }
  &:hover span {
    border: 1px solid black;
    border-radius: 10px;
    padding: 0 5px 0 5px;
  }`
  }
`;

export const StyledStudentIdContainerDiv = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const StyledStatusContainerDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

export const StyledTeamNameContainerDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: normal;
`;

export const StyledUniversityContainerDiv = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: normal;
`;

export const StyledEmailSpan = styled.span<{ $isHeader: boolean }>`
  height: 100%;
  background-color: ${({ $isHeader: isHeader, theme }) => isHeader ? 'transparent' : theme.background};
  display: flex;
  align-items: center;
  position: absolute;
  transition: background-color 0s;

  &:hover {
    background-color: ${({ theme, $isHeader }) => $isHeader ? 'transparent' : theme.colours.sidebarBackground};
  }
`;
