import { styled } from "styled-components";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";

export const StyledCustomCheckbox = styled.input<{ $role: CompetitionRole }>`
  appearance: none;
  -webkit-appearance: none;
  outline: none;

  cursor: pointer;
  width: 16px;
  height: 16px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  border-radius: 5px;


  &:checked {
    background-color: ${({ theme, $role }) => (
      $role === CompetitionRole.Admin ?
      theme.roles.adminText :
      $role === CompetitionRole.Coach ?
      theme.roles.coachText :
      theme.roles.siteCoordinatorText
    )};
  }
`;

export const StyledCustomRadio = styled.input<{ $access?: StaffAccess }>`
  appearance: none;
  -webkit-appearance: none;
  outline: none;

  cursor: pointer;
  width: 16px;
  height: 16px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  border-radius: 50%;

  &:checked {
    background-color: ${({ theme, $access }) => (
      $access === StaffAccess.Accepted ?
      theme.access.acceptedText :
      $access === StaffAccess.Pending ?
      theme.access.pendingText :
      theme.access.rejectedText
   )};
  }
`;

export const StyledRoleLabelDiv = styled.div<{ $role: CompetitionRole }>`
  width: 60%;
  border: 1px solid ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminText :
    $role === CompetitionRole.Coach ?
    theme.roles.coachText :
    theme.roles.siteCoordinatorText
  )};
  border-radius: 5px;

  box-sizing: border-box;
  padding-left: 2px;
  margin-bottom: 5px;

  background-color: ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminBackground :
    $role === CompetitionRole.Coach ?
    theme.roles.coachBackground :
    theme.roles.siteCoordinatorBackground
  )};

  color: ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminText :
    $role === CompetitionRole.Coach ?
    theme.roles.coachText :
    theme.roles.siteCoordinatorText
  )};
`;

export const StyledAccessLabelDiv = styled.div<{ $access: StaffAccess }>`
  width: 60%;
  border: 1px solid ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedText :
    $access === StaffAccess.Pending ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};
  border-radius: 5px;

  box-sizing: border-box;
  padding-left: 2px;
  margin-bottom: 5px;

  background-color: ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedBackground :
    $access === StaffAccess.Pending ?
    theme.access.pendingBackground :
    theme.access.rejectedBackground
  )};

  color: ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedText :
    $access === StaffAccess.Pending ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};
`;