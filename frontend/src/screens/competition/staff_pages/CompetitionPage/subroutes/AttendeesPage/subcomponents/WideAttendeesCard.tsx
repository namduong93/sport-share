import { FC, useState } from "react";
import { AttendeesCardProps } from "./AttendeesCardProps";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentPage.styles";
import { CompRoles, StyledStandardContainerDiv } from "../../StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";
import { StyledBooleanStatus } from "./BooleanStatus";
import { AttendeesInfoBar } from "../../../components/InfoBar/AttendeesInfoBar/AttendeesInfoBar";

/**
 * A React component for displaying attendee information in a compact card format within
 * a competition context.
 *
 * The `WideAttendeesCard` component displays an attendee's details, such as their full name,
 * gender, role, university, T-shirt size, dietary needs, allergies, and accessibility requirements.
 * It includes a feature where double-clicking the card toggles the visibility of the AttendeesInfoBar,
 * which provides additional information about the attendee. The card is styled for wider displays and
 * provides an expanded view of the attendee details.
 *
 * @param {AttendeesCardProps} props - React props containing attendeeDetails, which includes information
 * about the attendee, such as name, gender, role, university, T-shirt size, dietary needs, allergies, and
 * accessibility needs. The component also accepts other props that are passed down to the outermost container
 * element.
 * @returns {JSX.Element} - A UI component that displays the attendee's information in a wider card format display.
 */
export const WideAttendeesCard: FC<AttendeesCardProps> = ({
  attendeesDetails,
  ...props
}) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return <>
    <AttendeesInfoBar
      attendeesDetails={attendeesDetails}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
    />
    <StyledWideInfoContainerDiv
      onDoubleClick={() => setIsInfoBarOpen((p) => !p)}
      {...props}
      className="wide-attendees-card--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv className="wide-attendees-card--StyledUserNameContainerDiv-0">
        <StyledUserNameGrid className="wide-attendees-card--StyledUserNameGrid-0">
          <StyledUserIcon className="wide-attendees-card--StyledUserIcon-0" />
          <StyledUsernameTextSpan className="wide-attendees-card--StyledUsernameTextSpan-0">
            {attendeesDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-0">
        <StyledStandardSpan className="wide-attendees-card--StyledStandardSpan-0">{attendeesDetails.sex}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <CompRoles roles={attendeesDetails.roles} />
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-1">
        <StyledStandardSpan className="wide-attendees-card--StyledStandardSpan-1">{attendeesDetails.universityName}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-attendees-card--StyledStandardSpan-2">{attendeesDetails.tshirtSize}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-3">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.dietaryNeeds}
          className="wide-attendees-card--StyledBooleanStatus-0">
          {/* {!!attendeesDetails.dietaryNeeds ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-4">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.allergies}
          className="wide-attendees-card--StyledBooleanStatus-1">
          {/* {!!attendeesDetails.allergies ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-5">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.accessibilityNeeds}
          className="wide-attendees-card--StyledBooleanStatus-2">
          {/* {!!attendeesDetails.accessibilityNeeds ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  </>;
}
