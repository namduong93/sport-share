import { FC } from "react";
import { UserAccess } from "../../../../shared_types/User/User";
import { sendRequest } from "../../../utility/request";
import {
  Field,
  StyledStudentInfoContainerDiv,
} from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/subcomponents/StudentInfoCard";
import { StyledNarrowStatusDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/StaffPage.styles";
import { AccessDropdown } from "./AccessDropdown";
import { ClubAccessCardProps } from "../ClubAccessPage";

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
  staffDetails,
  staffListState: [staffList, setStaffList],
  ...props
}) => {
  const handleAccessChange = async (
    userId: number | undefined,
    newAccess: UserAccess
  ) => {
    if (userId) {
      try {
        await sendRequest.post("/user/staff_requests", {
          staffRequests: [{ userId, access: newAccess }],
        });
        const userIndex = staffList.findIndex(
          (staff) => staff.userId === userId
        );
        setStaffList([
          ...staffList.slice(0, userIndex),
          { ...staffList[userIndex], userAccess: newAccess },
          ...staffList.slice(userIndex + 1),
        ]);
      } catch (error) {
        console.error("Error updating staff access: ", error);
      }
    }
  };

  return (
    <StyledStudentInfoContainerDiv
      {...props}
      className="narrow-staff-access-card--StyledStudentInfoContainerDiv-0">
      <Field label="Full Name" value={staffDetails.name} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Affiliation" value={staffDetails.universityName} style={{ width: '20%', minWidth: '170px', whiteSpace: 'break-spaces' }} />
      <Field
        label="Access"
        value={
          <StyledNarrowStatusDiv className="narrow-staff-access-card--StyledNarrowStatusDiv-0">
            <AccessDropdown
              staffId={staffDetails.userId}
              currentAccess={staffDetails.userAccess}
              onChange={(newAccess) =>
                handleAccessChange(staffDetails.userId, newAccess)
              }
            />
          </StyledNarrowStatusDiv>
        }
        style={{ width: "20%", minWidth: "125px" }}
      />
      <Field
        label="Email"
        value={staffDetails.email}
        style={{ width: "25%", minWidth: "170px" }}
      />
      <div style={{ display: "flex" }}></div>
    </StyledStudentInfoContainerDiv>
  );
};
