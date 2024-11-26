import { styled } from "styled-components";
import { TeamStatus } from "../../../../../../../../shared_types/Competition/team/TeamStatus";

export const StyledInfoBarField = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 4px;
`;

export const StyledVerticalInfoBarField = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 25px;
  justify-content: center;
  column-gap: 4px;
`;

export const StyledLabelSpan = styled.span<{ $isEditing?: boolean }>`
  font-weight: bold;
  color: ${({ theme, $isEditing: isEditing }) => isEditing ? theme.colours.secondaryDark : theme.colours.primaryDark };
  /* min-width: 50%; */
  /* max-width: 160px; */
`;

export const StyledNoWrapLabelSpan = styled(StyledLabelSpan)`
  white-space: nowrap;
`;

export const StyledTeamDetailsLabelSpan = styled(StyledLabelSpan)`
  width: 65px;
`;

export const StyledTitleDiv = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme, $isOpen }) => $isOpen ? theme.fonts.fontSizes.title : '0'};
`;

export const StyledTeamStatusDiv = styled.div<{ $status: TeamStatus }>`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 25px;
  box-sizing: border-box;
  max-width: 175px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  line-height: 1;
  justify-content: center;

  background-color: ${({ theme, $status }) => (
    $status === TeamStatus.Registered ?
    theme.access.acceptedBackground :
    $status === TeamStatus.Unregistered ?
    theme.access.pendingBackground :
    theme.access.rejectedBackground
  )};

  border: 1px solid ${({ theme, $status }) => (
    $status === TeamStatus.Registered ?
    theme.access.acceptedText :
    $status === TeamStatus.Unregistered ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};

  color: ${({ theme, $status }) => (
    $status === TeamStatus.Registered ?
    theme.access.acceptedText :
    $status === TeamStatus.Unregistered ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};
`;

export const StyledMemberUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding-left: 0;
  
`;

export const StyledSelect = styled.select`
  width: 75%;
  border-radius: 5px;
  min-height: 30px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
`;

export const StyledMemberSpan = styled(StyledLabelSpan)`
  font-size: ${({ theme }) => theme.fonts.fontSizes.subheading};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.regular};
  color: ${({ theme }) => theme.teamView.levelA};
  background-color: ${({ theme }) => theme.background};
  width: 100%;
`;

export const StyledMemberContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  /* z-index: 0; */
`;

export const StyledTeamContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 2;
  width: 100%;
  box-shadow: 0 2px 0px 0px rgba(0, 0, 0, 0.05);
  margin: 0;
  padding: 0;
`;