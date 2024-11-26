import { FC, useState } from "react";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { AttendeesDetails } from "../../../../../../../../shared_types/Competition/staff/AttendeesDetails";
import {
  StyledInfoBarField,
  StyledLabelSpan,
  StyledVerticalInfoBarField,
} from "../TeamInfoBar/TeamInfoBar.styles";
import { StyledProfilePic } from "../../../../../../Account/Account.styles";
import { CompRoles } from "../../../subroutes/StaffPage/subcomponents/CompRoles";
import { backendURL } from "../../../../../../../../config/backendURLConfig";

interface AttendeesInfoProps extends InfoBarProps {
  attendeesDetails: AttendeesDetails;
}

/**
 * A functional component for displaying attendee information in a collapsible info bar.
 *
 * The `AttendeesInfoBar` component provides a detailed view of attendee information,
 * including their name, contact details, roles, dietary requirements, and site-related information.
 *
 * @param {AttendeesInfoProps} props - React AttendeesInfoProps specified above, where isOpenState manages
 * the open/closed state of the `InfoBar`.
 * @returns {JSX.Element} - A collapsible information bar displaying attendee details.
 */
export const AttendeesInfoBar: FC<AttendeesInfoProps> = ({
  attendeesDetails,
  isOpenState: [isOpen, setIsOpen],
}) => {
  const [attendeesData] = useState(attendeesDetails);

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]}>

      <StyledInfoBarField className="attendees-info-bar--StyledInfoBarField-0">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-0">User Id:</StyledLabelSpan>
        <span>{attendeesData.userId}</span>
      </StyledInfoBarField>

      <StyledProfilePic
        style={{ marginBottom: "15px" }}
        $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
        className="attendees-info-bar--StyledProfilePic-0" />

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-0">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-1">Name:</StyledLabelSpan>
        <span>{attendeesData.name}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-1">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-2">Preferred Name:</StyledLabelSpan>
        <span>{attendeesData.preferredName}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-2">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-3">Email:</StyledLabelSpan>
        <span>{attendeesData.email}</span>
      </StyledVerticalInfoBarField>

      <StyledInfoBarField className="attendees-info-bar--StyledInfoBarField-1">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-4">Gender:</StyledLabelSpan>
        <span>{attendeesData.sex}</span>
      </StyledInfoBarField>

      <StyledInfoBarField className="attendees-info-bar--StyledInfoBarField-2">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-5">Shirt Size:</StyledLabelSpan>
        <span>{attendeesData.tshirtSize}</span>
      </StyledInfoBarField>

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-3">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-6">Dietary Requirements:</StyledLabelSpan>
        <span>{attendeesData.dietaryNeeds}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-4">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-7">Allergies:</StyledLabelSpan>
        <span>{attendeesData.allergies}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-5">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-8">Accessibility Needs:</StyledLabelSpan>
        <span>{attendeesData.accessibilityNeeds}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-6">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-9">Roles:</StyledLabelSpan>
        <StyledInfoBarField
          style={{ maxWidth: '130px' }}
          className="attendees-info-bar--StyledInfoBarField-3">
          <CompRoles roles={attendeesData.roles} />
        </StyledInfoBarField>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-7">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-10">Site:</StyledLabelSpan>
        <span>{attendeesData.siteName}</span>
      </StyledVerticalInfoBarField>

      <StyledInfoBarField className="attendees-info-bar--StyledInfoBarField-4">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-11">Site Capacity:</StyledLabelSpan>
        <span>{attendeesData.siteCapacity}</span>
      </StyledInfoBarField>

      <StyledVerticalInfoBarField className="attendees-info-bar--StyledVerticalInfoBarField-8">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-12">Pending Site:</StyledLabelSpan>
        <span>{attendeesData.pendingSiteName ? attendeesData.pendingSiteName : 'None'}</span>
      </StyledVerticalInfoBarField>

      <StyledInfoBarField className="attendees-info-bar--StyledInfoBarField-5">
        <StyledLabelSpan className="attendees-info-bar--StyledLabelSpan-13">Pending Site Capacity:</StyledLabelSpan>
        <span>{attendeesData.pendingSiteCapacity ? attendeesData.pendingSiteCapacity : 'N/A'}</span>
      </StyledInfoBarField>
    </InfoBar>
  );
}
