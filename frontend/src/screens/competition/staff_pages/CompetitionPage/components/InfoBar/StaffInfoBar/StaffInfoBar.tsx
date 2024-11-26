import { FC, useEffect, useState } from "react";
import { RxReset } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { InfoBar, InfoBarProps } from "../InfoBar";
import {
  StaffAccess,
  StaffInfo,
} from "../../../../../../../../shared_types/Competition/staff/StaffInfo";
import { useTheme } from "styled-components";
import { sendRequest } from "../../../../../../../utility/request";
import {
  StyledEditIcon,
  StyledEditIconButton,
  StyledProfilePic,
} from "../../../../../../Account/Account.styles";
import { backendURL } from "../../../../../../../../config/backendURLConfig";
import { StyledEditableTextArea } from "../components/TeamStudentInfoCard";
import {
  StyledAccessLabelDiv,
  StyledCustomCheckbox,
  StyledCustomRadio,
  StyledRoleLabelDiv,
} from "./StaffInfoBar.styles";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { CompRoles } from "../../../subroutes/StaffPage/subcomponents/CompRoles";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";
import { StyledStaffAccessLevel } from "../../../subroutes/StaffPage/StaffPage.styles";
import {
  StyledInfoBarField,
  StyledLabelSpan,
  StyledNoWrapLabelSpan,
  StyledVerticalInfoBarField,
} from "../TeamInfoBar/TeamInfoBar.styles";
import { StyledCompetitionInfoContainerDiv } from "../StudentsInfoBar/StudentsInfoBar";

interface StaffInfoProps extends InfoBarProps {
  staffInfo: StaffInfo;
  staffListState: [
    Array<StaffInfo>,
    React.Dispatch<React.SetStateAction<Array<StaffInfo>>>
  ];
}

/**
 * A React component for displaying and editing staff information
 *
 * The `StaffInfoBar` component shows details such as user ID, university name, email,
 * bio, roles, access level, and more. The component allows for editing and saving staff information,
 * with an option to toggle roles and modify access levels.
 *
 * @param {StaffInfoProps} props - React StaffInfoProps specified above, where staffInfo is the initial
 * staff data to display, staffListState containes the functions to update the list and isOpenState controls
 * the visibility of the info bar.
 * @returns {JSX.Element} - A UI component that displays a staff information bar with editable fields.
 */
export const StaffInfoBar: FC<StaffInfoProps> = ({
  staffInfo,
  staffListState: [staffList, setStaffList],
  isOpenState: [isOpen, setIsOpen],
}) => {
  const theme = useTheme();
  const { compId } = useParams();
  const [staffData, setStaffData] = useState(staffInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  // Checks if the 'staffData' has been mofiied compared to the original
  useEffect(() => {
    if (
      staffData.access === staffInfo.access &&
      staffData.bio === staffInfo.bio &&
      staffData.roles.every((staffRole) =>
        staffInfo.roles.includes(staffRole)
      ) &&
      staffInfo.roles.every((staffRole) => staffData.roles.includes(staffRole))
    ) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [staffData]);

  // Handles role assignment by adding the role to the staff members array, otherwise
  // it removes the role
  const handleToggleRole = (role: CompetitionRole) => {
    const roleIndex = staffData.roles.indexOf(role);
    // adding the role since it doesn't exist currently
    if (roleIndex < 0) {
      setStaffData((p) => ({ ...p, roles: [...staffData.roles, role] }));
      return;
    }

    // removing the role since it exists
    setStaffData((p) => ({
      ...p,
      roles: [
        ...staffData.roles.slice(0, roleIndex),
        ...staffData.roles.slice(roleIndex + 1),
      ],
    }));
  };

  // Updates the staff list and sends it to the backend for processing
  // and storage
  const handleSaveEdit = async () => {
    const currentStaffIndex = staffList.findIndex(
      (staff) => staff.userId === staffData.userId
    );
    if (currentStaffIndex < 0) {
      return;
    }
    setStaffList([
      ...staffList.slice(0, currentStaffIndex),
      staffData,
      ...staffList.slice(currentStaffIndex + 1),
    ]);
    await sendRequest.post("/competition/staff/update", {
      staffList: [staffData],
      compId,
    });
    setIsEdited(false);
  };

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]}>

      <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-0">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-0">User Id:</StyledLabelSpan>
        <span>{staffData.userId}</span>
      </StyledInfoBarField>

      <StyledProfilePic
        style={{ marginBottom: "15px" }}
        $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
        className="staff-info-bar--StyledProfilePic-0" />

      <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-0">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-1">University Name:</StyledLabelSpan>
        <span>{staffData.universityName}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-1">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-2">Name:</StyledLabelSpan>
        <span>{staffData.name}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-2">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-3">Email:</StyledLabelSpan>
        <span>{staffData.email}</span>
      </StyledVerticalInfoBarField>

      <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-1">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-4">Gender:</StyledLabelSpan>
        <span>{staffData.sex}</span>
      </StyledInfoBarField>

      <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-2">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-5">Pronouns:</StyledLabelSpan>
        <span>{staffData.pronouns}</span>
      </StyledInfoBarField>

      <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-3">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-6">Shirt Size:</StyledLabelSpan>
        <span>{staffData.tshirtSize}</span>
      </StyledInfoBarField>

      <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-3">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-7">Allergies:</StyledLabelSpan>
        <span>{staffData.allergies}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-4">
        <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-8">Dietary Requirements:</StyledLabelSpan>
        <span>{staffData.dietaryReqs}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-5">
        <StyledNoWrapLabelSpan className="staff-info-bar--StyledNoWrapLabelSpan-0">Accessibility Requirements:</StyledNoWrapLabelSpan>
        <span>{staffData.accessibilityReqs}</span>
      </StyledVerticalInfoBarField>

      <StyledCompetitionInfoContainerDiv className="staff-info-bar--StyledCompetitionInfoContainerDiv-0">
        <StyledEditIconButton
          style={{ position: "absolute", right: 0, top: 0 }}
          onClick={() => setIsEditing((p) => !p)}
          className="staff-info-bar--StyledEditIconButton-0">
          <StyledEditIcon className="staff-info-bar--StyledEditIcon-0" />
        </StyledEditIconButton>
        <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-6">
          <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-9">Bio:</StyledLabelSpan>
          {isEditing ? <StyledEditableTextArea
            onChange={(e) => setStaffData((p) => ({ ...p, bio: e.target.value }))}
            value={staffData.bio}
            className="staff-info-bar--StyledEditableTextArea-0" />
          : <span>{staffData.bio}</span>}
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-7">
          <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-10">Roles:</StyledLabelSpan>
          {isEditing ? <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-4">
              <StyledCustomCheckbox
                type='checkbox'
                $role={CompetitionRole.Admin}
                checked={staffData.roles.includes(CompetitionRole.Admin)}
                onChange={() => handleToggleRole(CompetitionRole.Admin)}
                className="staff-info-bar--StyledCustomCheckbox-0" />
              <StyledRoleLabelDiv
                $role={CompetitionRole.Admin}
                className="staff-info-bar--StyledRoleLabelDiv-0">Admin</StyledRoleLabelDiv>
            </StyledInfoBarField>
            <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-5">
              <StyledCustomCheckbox
                type='checkbox'
                $role={CompetitionRole.Coach}
                checked={staffData.roles.includes(CompetitionRole.Coach)}
                onChange={() => handleToggleRole(CompetitionRole.Coach)}
                className="staff-info-bar--StyledCustomCheckbox-1" />
              <StyledRoleLabelDiv
                $role={CompetitionRole.Coach}
                className="staff-info-bar--StyledRoleLabelDiv-1">Coach</StyledRoleLabelDiv>
            </StyledInfoBarField>
            <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-6">
              <StyledCustomCheckbox
                type='checkbox'
                $role={CompetitionRole.SiteCoordinator}
                checked={staffData.roles.includes(CompetitionRole.SiteCoordinator)}
                onChange={() => handleToggleRole(CompetitionRole.SiteCoordinator)}
                className="staff-info-bar--StyledCustomCheckbox-2" />
              <StyledRoleLabelDiv
                $role={CompetitionRole.SiteCoordinator}
                className="staff-info-bar--StyledRoleLabelDiv-2">Site-Coordinator</StyledRoleLabelDiv>
            </StyledInfoBarField>
          </div> :
          <StyledInfoBarField
            style={{ maxWidth: '160px' }}
            className="staff-info-bar--StyledInfoBarField-7">
            <CompRoles roles={staffData.roles} />
          </StyledInfoBarField>}
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="staff-info-bar--StyledVerticalInfoBarField-8">
          <StyledLabelSpan className="staff-info-bar--StyledLabelSpan-11">Access:</StyledLabelSpan>
          {isEditing ? <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-8">
              <StyledCustomRadio
                type='radio'
                name='staff-access-edit-radio'
                $access={staffData.access}
                checked={staffData.access === StaffAccess.Accepted}
                onChange={() => setStaffData((p) => ({ ...p, access: StaffAccess.Accepted }))}
                className="staff-info-bar--StyledCustomRadio-0" />
              <StyledAccessLabelDiv
                $access={StaffAccess.Accepted}
                className="staff-info-bar--StyledAccessLabelDiv-0">Accepted</StyledAccessLabelDiv>
            </StyledInfoBarField>
            <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-9">
              <StyledCustomRadio
                type='radio'
                name='staff-access-edit-radio'
                $access={staffData.access}
                checked={staffData.access === StaffAccess.Pending}
                onChange={() => setStaffData((p) => ({ ...p, access: StaffAccess.Pending }))}
                className="staff-info-bar--StyledCustomRadio-1" />
              <StyledAccessLabelDiv
                $access={StaffAccess.Pending}
                className="staff-info-bar--StyledAccessLabelDiv-1">Pending</StyledAccessLabelDiv>
            </StyledInfoBarField>
            <StyledInfoBarField className="staff-info-bar--StyledInfoBarField-10">
              <StyledCustomRadio
                type='radio'
                name='staff-access-edit-radio'
                $access={staffData.access}
                checked={staffData.access === StaffAccess.Rejected}
                onChange={() => setStaffData((p) => ({ ...p, access: StaffAccess.Rejected }))}
                className="staff-info-bar--StyledCustomRadio-2" />
              <StyledAccessLabelDiv
                $access={StaffAccess.Rejected}
                className="staff-info-bar--StyledAccessLabelDiv-2">Rejected</StyledAccessLabelDiv>
            </StyledInfoBarField>
          </div> :
          <StyledStaffAccessLevel
            $access={staffData.access}
            className="staff-info-bar--StyledStaffAccessLevel-0">{staffData.access}</StyledStaffAccessLevel>}
        </StyledVerticalInfoBarField>
        {isEdited && 
      <div style={{ display: 'flex' }}>
        <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
          <TransparentResponsiveButton
            actionType="error"
            label="Reset"
            isOpen={false}
            onClick={() => setStaffData(staffInfo)}
            icon={<RxReset />}
            style={{
              backgroundColor: theme.colours.cancel,
          }} />
        </div>
        
        <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
          <TransparentResponsiveButton
            actionType="confirm"
            label="Save Changes"
            isOpen={false}
            onClick={handleSaveEdit}
            icon={<FaSave />}
            style={{
              backgroundColor: theme.colours.confirm,
          }} />
        </div>
      </div>}
      </StyledCompetitionInfoContainerDiv>
    </InfoBar>
  );
}
