import { FC } from "react";
import { StyledStandardSpan } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/WideStaffCard";
import { AccessDropdown } from "./AccessDropdown";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentPage.styles";
import { StyledStandardContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/CompRoles";
import { ClubAccessCardProps } from "../ClubAccessPage";
import { formatDateTime } from "../../competition/register/RegisterForm/subroutes/CompInformation/CompInformation";

/**
 * A React component that displays detailed information about a staff member on a wider display
 *
 * The `WideStaffAccessCard` component shows staff member details such as their name, university affiliation,
 * email, and current access level. It also provides a dropdown menu for changing the staff member's access level.
 *
 * @param {ClubAccessCardProps} props - React ClubAccessCardProps, including:
 * staffDetails, which is the details of the staff member and staffListState, which manages the list.
 * @returns {JSX.Element} - A UI component displaying staff details with the ability to modify their access on a
 * wider displat.
 */
export const WideStaffAccessCard: FC<ClubAccessCardProps> = ({
  memberDetails,
  memberListState: [_memberList, _setMemberList],
  ...props
}) => {

  return <>
    <StyledWideInfoContainerDiv
      {...props}
      className="wide-staff-access-card--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv className="wide-staff-access-card--StyledUserNameContainerDiv-0">
        <StyledUserNameGrid className="wide-staff-access-card--StyledUserNameGrid-0">
          <StyledUserIcon className="wide-staff-access-card--StyledUserIcon-0" />
          <StyledUsernameTextSpan className="wide-staff-access-card--StyledUsernameTextSpan-0">
            {memberDetails.preferredName}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-0">
        <StyledStandardSpan className="wide-staff-access-card--StyledStandardSpan-0">
          {memberDetails.referrer}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-access-card--StyledStandardSpan-1">
          {memberDetails.credit}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-access-card--StyledStandardSpan-1">
          {memberDetails.playerStats.attack}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-access-card--StyledStandardSpan-1">
          {memberDetails.bio}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-access-card--StyledStandardSpan-1">
          {formatDateTime(Number(memberDetails.lastTimePlayed)).split(' at ')[0]}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-access-card--StyledStandardSpan-1">
          {formatDateTime(Number(memberDetails.joinAt)).split(' at ')[0]}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  </>;
}
