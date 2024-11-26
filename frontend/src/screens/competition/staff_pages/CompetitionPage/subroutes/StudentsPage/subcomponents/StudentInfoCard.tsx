import React, { FC, ReactNode, useState } from "react";
import styled from "styled-components";
import { StudentInfo } from "../../../../../../../../shared_types/Competition/student/StudentInfo";
import { StyledNarrowStatusDiv } from "../../StaffPage/StaffPage.styles";
import { StudentStatus } from "./StudentStatus";
import { StudentsInfoBar } from "../../../components/InfoBar/StudentsInfoBar/StudentsInfoBar";

export const StyledStudentInfoContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  flex-wrap: wrap;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  box-sizing: border-box;
  font-size: 13px;
  color: ${({ theme }) => theme.fonts.colour};

  &:hover {
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
  }
`;

const StyledContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  min-height: 60px;
  height: auto;
  row-gap: 3px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledFieldTitle = styled.div`
  flex: 1;
  width: 100%;
  text-align: center;
  align-content: end;
  font-weight: bold;
  border-bottom: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  box-sizing: border-box;
`;

const StyledFieldValue = styled.div`
  width: 100%;
  flex: 2 1 auto;
  flex-direction: column;
  height: fit-content;
  text-align: center;
  text-overflow: ellipsis;
  overflow: visible;
  max-width: 170px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

interface FieldContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
};

/**
 * A React component that displays a labeled field with a title and value in a container.
 *
 * The `Field` component is used to show a key-value pair, where the key is the field's label
 * (e.g., "Full Name", "Email"), and the value is the actual data to be displayed (e.g., the student's name or email).
 *
 * @param {FieldContainerProps} props - React FiledContainerProps as specified above
 * @returns {JSX.Element} - A JSX element representing a field with its label and value.
 */
export const Field: FC<FieldContainerProps> = ({
  label,
  value,
  style,
  ...props
}) => {
  return (
    <StyledContainerDiv
      style={{ ...style }}
      {...props}
      className="student-info-card--StyledContainerDiv-0">
      <StyledFieldTitle className="student-info-card--StyledFieldTitle-0">{label}</StyledFieldTitle>
      <StyledFieldValue className="student-info-card--StyledFieldValue-0">{value}</StyledFieldValue>
    </StyledContainerDiv>
  );
}

export interface StudentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  studentInfo?: StudentInfo;
  studentsState: [
    Array<StudentInfo>,
    React.Dispatch<React.SetStateAction<Array<StudentInfo>>>
  ];
};

/**
 * A React component for displaying detailed student information within a competition.
 *
 * The `StudentInfoCard` component shows a student's details, such as name, email, status, and team name,
 * in a card-like layout. It includes features for viewing and toggling additional student information via
 * the `StudentsInfoBar`.
 *
 * @param {StudentCardProps} props - React StudentCardProps as specified above, including:
 * 'studentInfo', which is the student's details to be displayed in the card.
 * 'studentsState' which managing the list of students in the competition.
 * @returns {JSX.Element} - A JSX element representing a student info card with adjustable detailed info.
 */
export const StudentInfoCard: FC<StudentCardProps> = ({
  style,
  studentInfo,
  studentsState: [students, setStudents],
  ...props
}) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  const { name, sex, email, status, studentId, teamName, level, tshirtSize, siteName }
    = studentInfo ?? {};
  return <>
    {studentInfo &&
    <StudentsInfoBar
      studentInfo={studentInfo}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
      studentsState={[students, setStudents]}
    />}
    <StyledStudentInfoContainerDiv
      onDoubleClick={() => setIsInfoBarOpen((p) => !p)}
      style={style}
      {...props}
      className="student-info-card--StyledStudentInfoContainerDiv-0">
      <Field label="Full Name" value={name} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Gender" value={sex} style={{ width: '10%', minWidth: '60px'}} />
      <Field label="Email" value={email} style={{ width: '25%', minWidth: '170px' }} />
      <Field label="Status" 
        value={
          <StyledNarrowStatusDiv className="student-info-card--StyledNarrowStatusDiv-0">
            <StudentStatus style={{ minWidth: '78px' }} isMatched={status === 'Matched'}>
              {status}
            </StudentStatus>
          </StyledNarrowStatusDiv>
        }
        style={{ width: '20%', minWidth: '88px' }}
      />
      <Field label="Identifier" value={studentId} style={{ width: '10%', minWidth: '70px' }} />
      <Field label="Team Name" value={teamName} style={{ width: '25%', minWidth: '163px' }}/>
      <Field label="Level" value={level} style={{ width: '10%', minWidth: '37px' }} />
      <Field label="Shirt Size" value={tshirtSize} style={{ width: '5%', minWidth: '65px' }}/>
      <Field label="Site" value={siteName} style={{ width: '25%', minWidth: '163px' }} />
      <div style={{ display: 'flex' }}>
        
      </div>
    </StyledStudentInfoContainerDiv>
  </>;
}
