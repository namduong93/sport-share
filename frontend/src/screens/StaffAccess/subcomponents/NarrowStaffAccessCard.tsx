import { FC } from "react";
import {
  Field,
  StyledStudentInfoContainerDiv,
} from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/subcomponents/StudentInfoCard";
import { AccessDropdown } from "./AccessDropdown";
import { ClubAccessCardProps } from "../ClubAccessPage";
import { formatDateTime } from "../../competition/register/RegisterForm/subroutes/CompInformation/CompInformation";

/**
 * A React card component for displaying and managing staff access details in a narrow layout.
 *
 * The `NarrowStaffAccessCard` component displays information about a staff member, including their name,
 * affiliation, access level, and email. It includes an `AccessDropdown` to allow users to change the staff
 * member's access level.
 *
 * @param {ClubAccessCardProps} props - React ClubAccessCardProps, including:
 * staffDetails, which is the details of the staff member and staffListState, which manages the list.
 * @returns {JSX.Element} - A UI card component displaying the staff member's details and the access dropdown
 * for narrow displays.
 */
export const NarrowStaffAccessCard: FC<ClubAccessCardProps> = ({
  memberDetails,
  ...props
}) => {

  return (
    <StyledStudentInfoContainerDiv
      {...props}
      className="narrow-staff-access-card--StyledStudentInfoContainerDiv-0">
      <Field label="Full Name" value={memberDetails.preferredName} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Referrer" value={memberDetails.referrer} style={{ width: '20%', minWidth: '170px', whiteSpace: 'break-spaces' }} />
      <Field
        label="Date Joined"
        value={formatDateTime(Number(memberDetails?.joinAt))}
        style={{ width: "25%", minWidth: "170px" }}
      />
      <div style={{ display: "flex" }}></div>
    </StyledStudentInfoContainerDiv>
  );
};
