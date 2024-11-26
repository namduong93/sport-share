import { FC } from "react";
import { useTheme } from "styled-components";
import { StyledUserNameContainerDiv, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentPage.styles";
import { StyledStandardContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/WideStaffCard";

/**
 * A React functional component for rendering the header row in the wide staff access table.
 *
 * The `WideStaffAccessHeader` component displays column headers for the wide staff information card,
 * including labels for "Full Name," "Role," "Affiliation," "Access," and "Email."
 *
 * @returns {JSX.Element} - A styled header row component for the wide staff access table
 */
export const WideStaffAccessHeader: FC = () => {
  const theme = useTheme();
  return (
    <StyledWideInfoContainerDiv
      $isHeader={true}
      style={{
        backgroundColor: theme.colours.userInfoCardHeader,
        fontWeight: 'bold'
      }}
      className="wide-staff-access-header--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv className="wide-staff-access-header--StyledUserNameContainerDiv-0">
        <StyledUsernameTextSpan className="wide-staff-access-header--StyledUsernameTextSpan-0">Full Name</StyledUsernameTextSpan>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-header--StyledStandardContainerDiv-0">
        <StyledStandardSpan className="wide-staff-access-header--StyledStandardSpan-0">Affiliation</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-header--StyledStandardContainerDiv-1">
        <StyledStandardSpan className="wide-staff-access-header--StyledStandardSpan-1">Access</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-header--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-access-header--StyledStandardSpan-2">Email</StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  );
}
