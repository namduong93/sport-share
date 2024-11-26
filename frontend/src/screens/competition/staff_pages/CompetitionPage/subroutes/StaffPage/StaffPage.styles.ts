import { styled } from "styled-components";
import { StaffAccess } from "../../../../../../../shared_types/Competition/staff/StaffInfo";

export const StyledStaffAccessLevel = styled.div<{ $access: StaffAccess }>`
  width: 80%;
  height: 50%;
  min-height: 25px;
  max-width: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedBackground :
    $access === StaffAccess.Pending ?
    theme.access.pendingBackground :
    theme.access.rejectedBackground
  )};

  border: 1px solid ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedText :
    $access === StaffAccess.Pending ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};

  color: ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedText :
    $access === StaffAccess.Pending ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};
`;

export const StyledNarrowStatusDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3px;
`;