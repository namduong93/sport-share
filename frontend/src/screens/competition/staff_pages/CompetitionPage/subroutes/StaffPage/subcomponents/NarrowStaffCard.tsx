import { FC, useState } from "react";
import { StaffCardProps } from "./StaffCardProps";
import {
  Field,
  StyledStudentInfoContainerDiv,
} from "../../StudentsPage/subcomponents/StudentInfoCard";
import {
  StyledNarrowStatusDiv,
  StyledStaffAccessLevel,
} from "../StaffPage.styles";
import { CompRoles } from "./CompRoles";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";
import { StaffInfoBar } from "../../../components/InfoBar/StaffInfoBar/StaffInfoBar";

/**
 * A React functional component for displaying a compact staff member information card.
 *
 * The `NarrowStaffCard` component renders key details about a staff member, including their
 * full name, role, affiliation, access level, and email. It integrates with the `StaffInfoBar`
 * to allow detailed information to be displayed in an expandable panel upon user interaction.
 *
 * @param {StaffCardProps} props - React StaffCardProps, which include:
 * 'staffDetails`, which is an object containing staff member details, and
 *  'staffListState' which manages the list of staff members
 * @returns {JSX.Element} - A styled, interactive UI component displaying summarized staff information,
 * with expandable functionality for more detailed views.
 */
export const NarrowStaffCard: FC<StaffCardProps> = ({
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
    <StyledStudentInfoContainerDiv
      onDoubleClick={() => setIsInfoBarOpen(true)}
      {...props}
      className="narrow-staff-card--StyledStudentInfoContainerDiv-0">
      <Field
        label="Full Name"
        value={staffDetails.name}
        style={{ width: "20%", minWidth: "120px" }}
      />
      <Field
        label="Role"
        value={
          <StyledNarrowStatusDiv className="narrow-staff-card--StyledNarrowStatusDiv-0">
            <CompRoles
              style={{ width: "100%" }}
              roles={staffDetails.roles as CompetitionRole[]}
            />
          </StyledNarrowStatusDiv>
        }
        style={{ width: "20%", minWidth: "125px" }}
      />
      <Field
        label="Affiliation"
        value={staffDetails.universityName}
        style={{
          width: "20%",
          minWidth: "170px",
          whiteSpace: "break-spaces",
        }}
      />
      <Field
        label="Access"
        value={
          <StyledNarrowStatusDiv className="narrow-staff-card--StyledNarrowStatusDiv-1">
            <StyledStaffAccessLevel
              $access={staffDetails.access as StaffAccess}
              className="narrow-staff-card--StyledStaffAccessLevel-0">
              {staffDetails.access}
            </StyledStaffAccessLevel>
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
  </>;
};
