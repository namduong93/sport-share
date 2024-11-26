/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { RxReset } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { StudentInfo } from "../../../../../../../../shared_types/Competition/student/StudentInfo";
import { sendRequest } from "../../../../../../../utility/request";
import {
  StyledEditIcon,
  StyledEditIconButton,
  StyledProfilePic,
} from "../../../../../../Account/Account.styles";
import { backendURL } from "../../../../../../../../config/backendURLConfig";
import { CompRoles } from "../../../subroutes/StaffPage/subcomponents/CompRoles";
import {
  StyledEditableInput,
  StyledEditableTextArea,
  StyledToggleSelect,
} from "../components/TeamStudentInfoCard";
import { StyledBooleanStatus } from "../../../subroutes/AttendeesPage/subcomponents/BooleanStatus";
import { CompetitionLevel } from "../../../../../../../../shared_types/Competition/CompetitionLevel";
import { StudentStatus } from "../../../subroutes/StudentsPage/subcomponents/StudentStatus";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";
import {
  StyledInfoBarField,
  StyledLabelSpan,
  StyledNoWrapLabelSpan,
  StyledSelect,
  StyledVerticalInfoBarField,
} from "../TeamInfoBar/TeamInfoBar.styles";

export const StyledCompetitionInfoContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  padding: 5px;
  position: relative;
  box-sizing: border-box;
  box-shadow: 0px 0.5px 1px 1px rgba(0, 0, 0, 0.15);
`;

const StyledContainer = styled.div`
  width: 100%;
`;

interface StudentsInfoProps extends InfoBarProps {
  studentInfo: StudentInfo;
  studentsState: [
    Array<StudentInfo>,
    React.Dispatch<React.SetStateAction<Array<StudentInfo>>>
  ];
};

/**
 * A React component for displaying and editing student information within an info bar.
 *
 * The `StudentsInfoBar` component includes fields like user ID, name, email, and other student-related details,
 * with options to edit certain fields.
 *
 * @param {StudentsInfoProps} props - React StudentInfoProps as specified above, where studentInfo is the student data
 * to display and edit, studentsState contains functions to manage the list of students and isOpenState manages the
 * info bar's open/close status.
 * @returns {JSX.Element} - A UI component that displays a student's information and provides editing options.
 */
export const StudentsInfoBar: FC<StudentsInfoProps> = ({
  studentInfo,
  studentsState: [students, setStudents],
  isOpenState: [isOpen, setIsOpen],
  ...props
}) => {
  const { compId } = useParams();
  const theme = useTheme();
  const cardRef = useRef(null);
  const [studentData, setStudentData] = useState(studentInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  // Detects if the student data has been edited
  useEffect(() => {
    if (
      Object.keys(studentData).every(
        (key) =>
          (studentData as Record<string, any>)[key] ===
          (studentInfo as Record<string, any>)[key]
      )
    ) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [studentData]);

  // Triggered when the Editing state changes, it auto scrolls the info bar when the user
  // starts editing
  useEffect(() => {
    if (cardRef.current && isEditing) {
      (cardRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };
  }, [isEditing, isEdited]);

  const handleSaveEdit = async () => {
    const currentStudentIndex = students.findIndex(
      (stud) => stud.userId === studentData.userId
    );
    if (currentStudentIndex < 0) {
      return;
    }

    const newStudents = [
      ...students.slice(0, currentStudentIndex),
      studentData,
      ...students.slice(currentStudentIndex + 1),
    ];

    setStudents(newStudents);
    await sendRequest.post("/competition/students/update", {
      studentList: [studentData],
      compId,
    });

    setIsEdited(false);
  };

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]} {...props}>
      <StyledContainer className="students-info-bar--StyledContainer-0">
        <StyledInfoBarField className="students-info-bar--StyledInfoBarField-0">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-0">User Id:</StyledLabelSpan>
          <span>{studentInfo.userId}</span>
        </StyledInfoBarField>
        <StyledProfilePic
          style={{ margin: "auto", marginBottom: "15px" }}
          $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
          className="students-info-bar--StyledProfilePic-0" />
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-0">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-1">Name:</StyledLabelSpan>
          <span>{studentInfo.name}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-1">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-2">Preferred Name:</StyledLabelSpan>
          <span>{studentInfo.preferredName}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-2">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-3">Email:</StyledLabelSpan>
          <span>{studentInfo.email}</span>
        </StyledVerticalInfoBarField>
        <StyledInfoBarField className="students-info-bar--StyledInfoBarField-1">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-4">Gender:</StyledLabelSpan>
          <span>{studentInfo.sex}</span>
        </StyledInfoBarField>
        <StyledInfoBarField className="students-info-bar--StyledInfoBarField-2">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-5">Pronouns:</StyledLabelSpan>
          <span>{studentInfo.pronouns}</span>
        </StyledInfoBarField>
        <StyledInfoBarField className="students-info-bar--StyledInfoBarField-3">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-6">Shirt Size:</StyledLabelSpan>
          <span>{studentInfo.tshirtSize}</span>
        </StyledInfoBarField>
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-3">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-7">Allergies:</StyledLabelSpan>
          <span>{studentInfo.allergies}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-4">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-8">Dietary Requirements:</StyledLabelSpan>
          <span>{studentInfo.dietaryReqs}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-5">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-9">Accessibility Info:</StyledLabelSpan>
          <span>{studentInfo.accessibilityReqs}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-6">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-10">Student Id:</StyledLabelSpan>
          <span>{studentInfo.studentId}</span>
        </StyledVerticalInfoBarField>
        {/* Team info */}
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-7">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-11">Team:</StyledLabelSpan>
          <span>{studentInfo.teamName}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-8">
          <StyledLabelSpan className="students-info-bar--StyledLabelSpan-12">Site:</StyledLabelSpan>
          <span>{studentInfo.siteName}</span>
        </StyledVerticalInfoBarField>
      </StyledContainer>

        {/* Competition user info */}
        <StyledCompetitionInfoContainerDiv
          ref={cardRef}
          className="students-info-bar--StyledCompetitionInfoContainerDiv-0">
          <StyledInfoBarField className="students-info-bar--StyledInfoBarField-4">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-13">Roles:</StyledLabelSpan>
            <CompRoles roles={studentData.roles} />
            <StyledEditIconButton
              onClick={() => setIsEditing((p) => !p)}
              className="students-info-bar--StyledEditIconButton-0">
              <StyledEditIcon className="students-info-bar--StyledEditIcon-0" />
            </StyledEditIconButton>
          </StyledInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-9">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-14">Bio:</StyledLabelSpan>
            {isEditing ? <StyledEditableTextArea
              onChange={(e) => setStudentData((p) => ({ ...p, bio: e.target.value }))}
              value={studentData.bio}
              className="students-info-bar--StyledEditableTextArea-0" />
            : <span>{studentData.bio}</span>}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-10">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-15">ICPC Eligible:</StyledLabelSpan>
            {isEditing ?
              <StyledToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, ICPCEligible: e.target.value === 'yes' }))}
                $toggled={studentData.ICPCEligible}
                className="students-info-bar--StyledToggleSelect-0">
                <option
                  selected={studentData.ICPCEligible}
                  style={{ backgroundColor: theme.colours.confirm }}
                  value='yes'
                  className="students-info-bar--option-0">Yes</option>
                <option
                  selected={!studentData.ICPCEligible}
                  style={{ backgroundColor: theme.colours.cancel }}
                  value='no'
                  className="students-info-bar--option-1">No</option>
              </StyledToggleSelect> :
            <StyledBooleanStatus
              style={{ height: '25px' }}
              $toggled={studentData.ICPCEligible}
              className="students-info-bar--StyledBooleanStatus-0" />}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-11">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-16">boersen Eligible:</StyledLabelSpan>
            {isEditing ?
              <StyledToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, boersenEligible: e.target.value === 'yes' }))}
                $toggled={studentData.boersenEligible}
                className="students-info-bar--StyledToggleSelect-1">
                <option
                  selected={studentData.boersenEligible}
                  style={{ backgroundColor: theme.colours.confirm }}
                  value='yes'
                  className="students-info-bar--option-2">Yes</option>
                <option
                  selected={!studentData.boersenEligible}
                  style={{ backgroundColor: theme.colours.cancel }}
                  value='no'
                  className="students-info-bar--option-3">No</option>
              </StyledToggleSelect> :
            <StyledBooleanStatus
              style={{ height: '25px' }}
              $toggled={studentData.boersenEligible}
              className="students-info-bar--StyledBooleanStatus-1" />}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-12">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-17">Level:</StyledLabelSpan>
            {isEditing ?
            <StyledSelect
              onChange={(e) => setStudentData((p) => ({ ...p, level: (e.target.value as CompetitionLevel) }))}
              className="students-info-bar--StyledSelect-0">
              <option
                selected={studentData.level === 'Level A'}
                value={CompetitionLevel.LevelA}
                className="students-info-bar--option-4">Level A</option>
              <option
                selected={!(studentData.level === 'Level A')}
                value={CompetitionLevel.LevelB}
                className="students-info-bar--option-5">Level B</option>
            </StyledSelect> :
            <span>{studentData.level}</span>}
          </StyledVerticalInfoBarField>
          <StyledInfoBarField
            style={{ width: '75%' }}
            className="students-info-bar--StyledInfoBarField-5">
            <StyledNoWrapLabelSpan className="students-info-bar--StyledNoWrapLabelSpan-0">Degree Year:</StyledNoWrapLabelSpan>
            {isEditing ?
            <StyledEditableInput
              type="number"
              value={studentData.degreeYear}
              onChange={(e) => setStudentData((p) => ({ ...p, degreeYear: parseInt(e.target.value) }))}
              className="students-info-bar--StyledEditableInput-0" /> :
            <span>{studentData.degreeYear}</span>}
          </StyledInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-13">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-18">Degree:</StyledLabelSpan>
            {isEditing ?
            <StyledEditableInput
              value={studentData.degree}
              onChange={(e) => setStudentData((p) => ({ ...p, degree: e.target.value }))}
              className="students-info-bar--StyledEditableInput-1" /> :
            <span>{studentData.degree}</span>}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-14">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-19">Is Remote:</StyledLabelSpan>
            {isEditing ?
              <StyledToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, isRemote: e.target.value === 'yes' }))}
                $toggled={studentData.isRemote}
                className="students-info-bar--StyledToggleSelect-2">
                <option
                  selected={studentData.isRemote}
                  style={{ backgroundColor: theme.colours.confirm }}
                  value='yes'
                  className="students-info-bar--option-6">Yes</option>
                <option
                  selected={!studentData.isRemote}
                  style={{ backgroundColor: theme.colours.cancel }}
                  value='no'
                  className="students-info-bar--option-7">No</option>
              </StyledToggleSelect> :
            <StyledBooleanStatus
              style={{ height: '25px' }}
              $toggled={studentData.isRemote}
              className="students-info-bar--StyledBooleanStatus-2" />}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-15">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-20">Is Official:</StyledLabelSpan>
            {isEditing ?
              <StyledToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, isOfficial: e.target.value === 'yes' }))}
                $toggled={studentData.isOfficial}
                className="students-info-bar--StyledToggleSelect-3">
                <option
                  selected={studentData.isOfficial}
                  style={{ backgroundColor: theme.colours.confirm }}
                  value='yes'
                  className="students-info-bar--option-8">Yes</option>
                <option
                  selected={!studentData.isOfficial}
                  style={{ backgroundColor: theme.colours.cancel }}
                  value='no'
                  className="students-info-bar--option-9">No</option>
              </StyledToggleSelect> :
            <StyledBooleanStatus
              style={{ height: '25px' }}
              $toggled={studentData.isOfficial}
              className="students-info-bar--StyledBooleanStatus-3" />}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-16">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-21">Preferred Contact:</StyledLabelSpan>
            {isEditing ?
            <StyledEditableInput
              value={studentData.preferredContact}
              onChange={(e) => setStudentData((p) => ({ ...p, preferredContact: e.target.value }))}
              className="students-info-bar--StyledEditableInput-2" /> :
            <span>{studentData.preferredContact}</span>}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-17">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-22">National Prizes:</StyledLabelSpan>
            {isEditing ?
            <StyledEditableInput
              value={studentData.nationalPrizes}
              onChange={(e) => setStudentData((p) => ({ ...p, nationalPrizes: e.target.value }))}
              className="students-info-bar--StyledEditableInput-3" /> :
            <span>{studentData.nationalPrizes}</span>}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-18">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-23">International Prizes:</StyledLabelSpan>
            {isEditing ?
            <StyledEditableInput
              value={studentData.internationalPrizes}
              onChange={(e) => setStudentData((p) => ({ ...p, internationalPrizes: e.target.value }))}
              className="students-info-bar--StyledEditableInput-4" /> :
            <span>{studentData.internationalPrizes}</span>}
          </StyledVerticalInfoBarField>
          <StyledInfoBarField
            style={{ width: '75%' }}
            className="students-info-bar--StyledInfoBarField-6">
            <StyledNoWrapLabelSpan className="students-info-bar--StyledNoWrapLabelSpan-1">Codeforces Rating:</StyledNoWrapLabelSpan>
            {isEditing ?
            <StyledEditableInput
              type="number"
              value={studentData.codeforcesRating}
              onChange={(e) => setStudentData((p) => ({ ...p, codeforcesRating: parseInt(e.target.value) }))}
              className="students-info-bar--StyledEditableInput-5" /> :
            <span>{studentData.codeforcesRating}</span>}
          </StyledInfoBarField>
          <StyledVerticalInfoBarField className="students-info-bar--StyledVerticalInfoBarField-19">
            <StyledLabelSpan className="students-info-bar--StyledLabelSpan-24">Status:</StyledLabelSpan>
            <StudentStatus style={{ height: '25px' }}
              isMatched={studentInfo.status === 'Matched'}
            >
              {studentInfo.status}
            </StudentStatus>
          </StyledVerticalInfoBarField>
          {isEdited && 
            <div style={{ display: 'flex' }}>
              <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
                <TransparentResponsiveButton
                  actionType="error"
                  label="Reset"
                  isOpen={false}
                  onClick={() => setStudentData(studentInfo)}
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
            </div>
          }
        </StyledCompetitionInfoContainerDiv>
    </InfoBar>
  );
};
