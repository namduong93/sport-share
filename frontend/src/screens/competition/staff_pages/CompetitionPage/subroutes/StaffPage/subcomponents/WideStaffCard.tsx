import { FC, useState } from "react";
import styled from "styled-components";
import { StaffCardProps } from "./StaffCardProps";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentPage.styles";
import { CompRoles, StyledStandardContainerDiv } from "./CompRoles";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";
import { StyledStaffAccessLevel } from "../StaffPage.styles";
import { StaffInfoBar } from "../../../components/InfoBar/StaffInfoBar/StaffInfoBar";

export const StyledStandardSpan = styled.span``;

/**
 * A React functional component for displaying a detailed staff member information card.
 *
 * The `WideStaffCard` component provides an expanded view of a staff member's details, including their
 * name, roles, university affiliation, access level, and email. It integrates with the `StaffInfoBar`
 * for viewing and editing additional information in a collapsible sidebar.
 *
 * @param {StaffCardProps} props - React StaffCardProps, which include:
 * 'staffDetails`, which is an object containing staff member details, and
 *  'staffListState' which manages the list of staff members
 * @returns {JSX.Element} - A styled, interactive UI component displaying detailed staff information,
 * with functionality for opening an expandable sidebar to edit or view further details.
 */

export const WideStaffCard: FC<StaffCardProps> = ({
  staffDetails,
  staffListState: [staffList, setStaffList],
  ...props
}) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return <>
    <StaffInfoBar
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
      staffInfo={staffDetails}
      staffListState={[staffList, setStaffList]}
    />
    <StyledWideInfoContainerDiv
      onDoubleClick={() => setIsInfoBarOpen(true)}
      {...props}
      className="wide-staff-card--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv className="wide-staff-card--StyledUserNameContainerDiv-0">
        <StyledUserNameGrid className="wide-staff-card--StyledUserNameGrid-0">
          <StyledUserIcon className="wide-staff-card--StyledUserIcon-0" />
          <StyledUsernameTextSpan className="wide-staff-card--StyledUsernameTextSpan-0">
            {staffDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv
        style={{ overflow: 'visible' }}
        className="wide-staff-card--StyledStandardContainerDiv-0">
        <StyledStandardContainerDiv
          style={{ maxWidth: '90%', overflow: 'visible' }}
          className="wide-staff-card--StyledStandardContainerDiv-1">
          <CompRoles roles={staffDetails.roles as CompetitionRole[]} />
        </StyledStandardContainerDiv>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-card--StyledStandardSpan-0">
          {staffDetails.universityName}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-card--StyledStandardContainerDiv-3">
        <StyledStaffAccessLevel
          $access={staffDetails.access as StaffAccess}
          className="wide-staff-card--StyledStaffAccessLevel-0">
          {staffDetails.access}
        </StyledStaffAccessLevel>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-card--StyledStandardContainerDiv-4">
        <StyledStandardSpan className="wide-staff-card--StyledStandardSpan-1">
          {staffDetails.email}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  </>;
}
