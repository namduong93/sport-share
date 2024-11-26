import { FC } from "react";
import { useTheme } from "styled-components";
import { StyledUserNameContainerDiv, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentPage.styles";
import { StyledStandardContainerDiv } from "../../StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";

/**
 * A React component for rendering the header of the wide attendee information display.
 *
 * The `WideAttendeesHeader` component is responsible for rendering the column headers for the attendee information
 * section, which includes Full Name, Gender, Role, University, Shirt Size, Dietary Needs, Allergies, and Accessibility.
 * The headers are styled with bold text and background color taken from the theme's `userInfoCardHeader` color.
 *
 * @returns {JSX.Element} - A UI component displaying the header row with attendee categories in a styled container.
 */
export const WideAttendeesHeader: FC = () => {
  const theme = useTheme();
  return (
    <StyledWideInfoContainerDiv
      $isHeader
      style={{
        backgroundColor: theme.colours.userInfoCardHeader,
        fontWeight: 'bold'
      }}
      className="wide-attendees-header--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv className="wide-attendees-header--StyledUserNameContainerDiv-0">
        <StyledUsernameTextSpan className="wide-attendees-header--StyledUsernameTextSpan-0">Full Name</StyledUsernameTextSpan>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-header--StyledStandardContainerDiv-0">
        <StyledStandardSpan className="wide-attendees-header--StyledStandardSpan-0">Gender</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-header--StyledStandardContainerDiv-1">
        <StyledStandardSpan className="wide-attendees-header--StyledStandardSpan-1">Role</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-header--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-attendees-header--StyledStandardSpan-2">University</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-header--StyledStandardContainerDiv-3">
        <StyledStandardSpan className="wide-attendees-header--StyledStandardSpan-3">Shirt Size</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-header--StyledStandardContainerDiv-4">
        <StyledStandardSpan className="wide-attendees-header--StyledStandardSpan-4">Dietary Needs</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-header--StyledStandardContainerDiv-5">
        <StyledStandardSpan className="wide-attendees-header--StyledStandardSpan-5">Allergies</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-header--StyledStandardContainerDiv-6">
        <StyledStandardSpan className="wide-attendees-header--StyledStandardSpan-6">Accessibility</StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  );
}
