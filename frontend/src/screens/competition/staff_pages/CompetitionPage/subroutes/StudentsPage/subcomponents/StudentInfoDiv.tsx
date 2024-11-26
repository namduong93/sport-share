import { FC, useState } from "react";
import { StudentCardProps } from "./StudentInfoCard";
import { StyledEmailContainerDiv, StyledEmailSpan, StyledSmallContainerDiv, StyledStatusContainerDiv, StyledStudentIdContainerDiv, StyledTeamNameContainerDiv, StyledUniversityContainerDiv, StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../StudentPage.styles";
import { StudentStatus } from "./StudentStatus";
import { StudentsInfoBar } from "../../../components/InfoBar/StudentsInfoBar/StudentsInfoBar";

/**
 * A React component for displaying student information in a wide container format.
 *
 * The `StudentInfoDiv` component shows key details of a student's profile such as name, sex, email, status, student ID,
 * team name, level, shirt size, and university/site. It includes a `StudentsInfoBar` component that can be toggled open
 * by double-clicking on the student's information.
 *
 * @param {StudentCardProps} props - React StudentCardProps as specified above, including:
 * 'studentInfo', which is the student's details to be displayed in the card.
 * 'studentsState' which managing the list of students in the competition.
 * @returns {JSX.Element} - A JSX element representing a student info container with an optional expandable info bar.
 */
export const StudentInfoDiv: FC<StudentCardProps> = ({
  style,
  studentInfo,
  studentsState: [students, setStudents],
  ...props
}) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  const {
    name,
    sex,
    email,
    status,
    studentId,
    teamName,
    level,
    tshirtSize,
    siteName,
  } = studentInfo ?? {
    name: "Full Name",
    sex: "Gender",
    email: "Email",
    status: "Status",
    studentId: "Identifier",
    teamName: "Team Name",
    level: "Level",
    tshirtSize: "Shirt Size",
    siteName: "Site",
  };

  return <>
  {studentInfo && 
  <StudentsInfoBar
    studentsState={[students, setStudents]}
    studentInfo={studentInfo}
    isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
  />}
  <StyledWideInfoContainerDiv
    $isHeader={!studentInfo}
    onDoubleClick={() => studentInfo && setIsInfoBarOpen((p) => !p)}
    style={style}
    {...props}
    className="student-info-div--StyledWideInfoContainerDiv-0">
    <StyledUserNameContainerDiv className="student-info-div--StyledUserNameContainerDiv-0">
      {!studentInfo ? <StyledUsernameTextSpan className="student-info-div--StyledUsernameTextSpan-0">{name}</StyledUsernameTextSpan> :
     <StyledUserNameGrid className="student-info-div--StyledUserNameGrid-0">
       <StyledUserIcon className="student-info-div--StyledUserIcon-0" />
       <StyledUsernameTextSpan className="student-info-div--StyledUsernameTextSpan-1">{name}</StyledUsernameTextSpan>
     </StyledUserNameGrid>}
    </StyledUserNameContainerDiv>
    <StyledSmallContainerDiv
      style={{ width: '10%' }}
      className="student-info-div--StyledSmallContainerDiv-0">
      {sex}
    </StyledSmallContainerDiv>
    <StyledEmailContainerDiv
      $isHeader={!studentInfo}
      className="student-info-div--StyledEmailContainerDiv-0">
      <StyledEmailSpan
        $isHeader={!studentInfo}
        className="student-info-div--StyledEmailSpan-0">
        {email}
      </StyledEmailSpan>
    </StyledEmailContainerDiv>
    <StyledStudentIdContainerDiv className="student-info-div--StyledStudentIdContainerDiv-0">
      {studentId}
    </StyledStudentIdContainerDiv>
    <StyledStatusContainerDiv className="student-info-div--StyledStatusContainerDiv-0">
      {studentInfo ? <StudentStatus isMatched={status === 'Matched'} >{status}</StudentStatus>
      : status}
    </StyledStatusContainerDiv>
    <StyledTeamNameContainerDiv className="student-info-div--StyledTeamNameContainerDiv-0">
      {teamName}
    </StyledTeamNameContainerDiv>
    <StyledSmallContainerDiv className="student-info-div--StyledSmallContainerDiv-1">{level}</StyledSmallContainerDiv>
    <StyledSmallContainerDiv className="student-info-div--StyledSmallContainerDiv-2">
      {tshirtSize}
    </StyledSmallContainerDiv>
    <StyledUniversityContainerDiv className="student-info-div--StyledUniversityContainerDiv-0">
      {siteName}
    </StyledUniversityContainerDiv>
    <StyledSmallContainerDiv className="student-info-div--StyledSmallContainerDiv-3"></StyledSmallContainerDiv>
  </StyledWideInfoContainerDiv>
  </>;
}
