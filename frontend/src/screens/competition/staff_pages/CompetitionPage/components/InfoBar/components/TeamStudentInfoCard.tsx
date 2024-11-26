/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useRef, useState } from "react";
import { FaArrowRight, FaSave } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import {
  Student,
  TeamDetails,
} from "../../../../../../../../shared_types/Competition/team/TeamDetails";
import { ButtonConfiguration } from "../../../hooks/useCompetitionOutletContext";
import styled, { useTheme } from "styled-components";
import { StyledTextArea } from "../../../../../../student/subcomponents/EditCompUserDetails/EditCompUserDetails.styles";
import { useParams } from "react-router-dom";
import { addStudentToTeam } from "../../../subroutes/TeamPage/utility/addStudentToTeam";
import { sendRequest } from "../../../../../../../utility/request";
import {
  StyledEditIcon,
  StyledEditIconButton,
} from "../../../../../../Account/Account.styles";
import { StyledLabelSpan } from "../TeamInfoBar/TeamInfoBar.styles";
import { CopyButton } from "../../../../../../../components/general_utility/CopyButton";
import { StyledBooleanStatus } from "../../../subroutes/AttendeesPage/subcomponents/BooleanStatus";
import { ResponsiveActionButton } from "../../../../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { AdvancedDropdown } from "../../../../../../../components/AdvancedDropdown/AdvancedDropdown";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";

const StyledMemberFieldDiv = styled.div`
  display: flex;
  column-gap: 4px;
  align-items: center;
`;

const StyledVerticalMemberFieldDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledMemberListItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px;
  position: relative;
  box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.1);
`;

export const StyledEditableInput = styled.input`
  margin-bottom: 0;
  border-radius: 5px;
  height: 30px;
  width: 75%;
  line-height: 0;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  padding: auto 0 0 0;
  box-sizing: border-box;
`;

export const StyledEditableTextArea = styled(StyledTextArea)`
  margin-bottom: 0;
  border-radius: 5px;
  height: 30px;
  width: 75%;
  box-sizing: border-box;
  resize: both;
  padding: 2px 0 0 3px;
  font: inherit;
`;

export const StyledToggleSelect = styled.select<{ $toggled: boolean }>`
  border-radius: 5px;
  width: 75%;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  background-color: ${({ $toggled, theme }) =>
    $toggled ? theme.colours.confirm : theme.colours.cancel};
`;

interface TeamStudentInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  student: Student;
  teamDetails: TeamDetails;
  popupOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamListState: [
    Array<TeamDetails>,
    React.Dispatch<React.SetStateAction<Array<TeamDetails>>>
  ];
  buttonConfigurationState: [
    ButtonConfiguration,
    React.Dispatch<React.SetStateAction<ButtonConfiguration>>
  ];
  isEditable: boolean;
}

/**
 * A React component for displaying and editing student information within a competition team.
 *
 * The `TeamStudentInfoCard` component allows for viewing and updating a student's details, such as name,
 * email, bio, competition eligibility, and prizes. It includes features for editing the student's information,
 * switching teams, saving changes, and resetting modifications. The card also supports conditional rendering
 * of form fields based on the editing state
 *
 * @param {TeamStudentInfoProps} props - React TeamStudentInfoProps specified above, where teamDetails is the information
 * about the team to which the student belongs, teamListState  manages the list of all teams in the competition and
 * buttonConfigurationState manages button configurations.
 * @returns {JSX.Element} - A UI component that displays a student's information and provides editing options.
 */
export const TeamStudentInfoCard: FC<TeamStudentInfoProps> = ({
  student,
  teamDetails,
  buttonConfigurationState: [, setButtonConfiguration],
  teamListState: [teamList, setTeamList],
  popupOpenState: [, setPopupOpen],
  isEditable,
}) => {
  const theme = useTheme();
  const { compId } = useParams();
  const cardRef = useRef(null);

  const [teamOptions, setTeamOptions] = useState(
    teamList.map((team) => ({
      value: String(team.teamId),
      label: team.teamName,
    }))
  );
  const [currentTeamOption, setCurrentTeamOption] = useState({
    value: "",
    label: "",
  });

  // Handles a student's change of team when the user selects a different team from
  // the dropdown. It updates the team's student list by moving the student to the new
  // team and displaying the confirm team changes button
  const handleSubmitTeamChange = async (student: Student) => {
    const newTeamId = parseInt(currentTeamOption.value);
    const currentTeamId = teamDetails.teamId;

    const newTeamIndex = teamList.findIndex(
      (team) => team.teamId === newTeamId
    );
    const currentTeamIndex = teamList.findIndex(
      (team) => team.teamId === currentTeamId
    );

    if (
      addStudentToTeam(student, currentTeamIndex, newTeamIndex, [
        teamList,
        setTeamList,
      ])
    ) {
      setButtonConfiguration((p) => ({
        ...p,
        enableTeamsChangedButtons: true,
      }));
    }
    setPopupOpen(false);
    return true;
  };

  const [isEditingCard, setIsEditingCard] = useState(false);
  const [studentData, setStudentData] = useState(student);
  const [isEdited, setIsEdited] = useState(false);

  // Triggered when the 'studentData' object changes, it checks whether the
  // 'studentData' is different from the initial and toggles the
  // Edit state
  useEffect(() => {
    if (
      Object.keys(studentData).every(
        (key) =>
          (studentData as Record<string, any>)[key] ===
          (student as Record<string, any>)[key]
      )
    ) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [studentData]);

  // Saves the edited student information and updates the team list
  const handleSaveEdit = async () => {
    const currentTeamIndex = teamList.findIndex(
      (team) => team.teamId === teamDetails.teamId
    );
    const studentIndex = teamDetails.students.findIndex(
      (stud) => stud.userId === student.userId
    );
    const newStudentsArray = [
      ...teamDetails.students.slice(0, studentIndex),
      studentData,
      ...teamDetails.students.slice(studentIndex + 1),
    ];

    setTeamList([
      ...teamList.slice(0, currentTeamIndex),
      { ...teamDetails, students: newStudentsArray },
      ...teamList.slice(currentTeamIndex + 1),
    ]);

    await sendRequest.post("/competition/teams/update", {
      teamList: [{ ...teamDetails, students: newStudentsArray }],
      compId,
    });
    setIsEdited(false);
  };

  const handleClickEdit = () => {
    setIsEditingCard((p) => !p);
  };

  // Triggered when the Editing state changes, it scrolls the card into
  // view smoothly to provide a better editing experience using cardRef to
  // target the card element
  useEffect(() => {
    if (cardRef.current && isEditingCard) {
      (cardRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [isEditingCard, isEdited]);

  return (
    <StyledMemberListItem
      ref={cardRef}
      key={student.userId}
      className="team-student-info-card--StyledMemberListItem-0">
      {isEditable && <StyledEditIconButton
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleClickEdit}
        style={{ position: 'absolute', right: 0, top: 0 }}
        className="team-student-info-card--StyledEditIconButton-0">
        <StyledEditIcon className="team-student-info-card--StyledEditIcon-0" />
      </StyledEditIconButton>}
      <StyledMemberFieldDiv className="team-student-info-card--StyledMemberFieldDiv-0">
        <StyledLabelSpan className="team-student-info-card--StyledLabelSpan-0">User Id:</StyledLabelSpan>
        <span>{student.userId}</span>
      </StyledMemberFieldDiv>
      <StyledVerticalMemberFieldDiv className="team-student-info-card--StyledVerticalMemberFieldDiv-0">
        <StyledLabelSpan className="team-student-info-card--StyledLabelSpan-1">Name:</StyledLabelSpan>
        <span>{studentData.name}</span>
      </StyledVerticalMemberFieldDiv>
      <StyledVerticalMemberFieldDiv className="team-student-info-card--StyledVerticalMemberFieldDiv-1">
        <StyledLabelSpan className="team-student-info-card--StyledLabelSpan-2">Email:</StyledLabelSpan>
        <div>
          <span>{studentData.email}</span>
          <CopyButton textToCopy={studentData.email} />
        </div>
      </StyledVerticalMemberFieldDiv>
      <StyledVerticalMemberFieldDiv className="team-student-info-card--StyledVerticalMemberFieldDiv-2">
        <StyledLabelSpan
          $isEditing={isEditingCard}
          className="team-student-info-card--StyledLabelSpan-3">Bio:</StyledLabelSpan>
        {isEditingCard ? <StyledEditableTextArea
          onChange={(e) => setStudentData((p) => ({ ...p, bio: e.target.value }))}
          value={studentData.bio}
          className="team-student-info-card--StyledEditableTextArea-0" />
        : <span>{studentData.bio}</span>}
      </StyledVerticalMemberFieldDiv>
      <StyledVerticalMemberFieldDiv className="team-student-info-card--StyledVerticalMemberFieldDiv-3">
        <StyledLabelSpan
          $isEditing={isEditingCard}
          className="team-student-info-card--StyledLabelSpan-4">ICPC Eligible:</StyledLabelSpan>
        {isEditingCard ?
          <StyledToggleSelect
            onChange={(e) => setStudentData((p) => ({ ...p, ICPCEligible: e.target.value === 'yes' }))}
            $toggled={studentData.ICPCEligible}
            className="team-student-info-card--StyledToggleSelect-0">
            <option
              selected={studentData.ICPCEligible}
              style={{ backgroundColor: theme.colours.confirm }}
              value='yes'
              className="team-student-info-card--option-0">Yes</option>
            <option
              selected={!studentData.ICPCEligible}
              style={{ backgroundColor: theme.colours.cancel }}
              value='no'
              className="team-student-info-card--option-1">No</option>
          </StyledToggleSelect> :
        <StyledBooleanStatus
          style={{ height: '25px' }}
          $toggled={studentData.ICPCEligible}
          className="team-student-info-card--StyledBooleanStatus-0" />}
      </StyledVerticalMemberFieldDiv>
      <StyledVerticalMemberFieldDiv className="team-student-info-card--StyledVerticalMemberFieldDiv-4">
        <StyledLabelSpan
          $isEditing={isEditingCard}
          className="team-student-info-card--StyledLabelSpan-5">Boersen Eligible:</StyledLabelSpan>
        {isEditingCard ?
          <StyledToggleSelect
            onChange={(e) => setStudentData((p) => ({ ...p, boersenEligible: e.target.value === 'yes' }))}
            $toggled={studentData.boersenEligible}
            className="team-student-info-card--StyledToggleSelect-1">
            <option
              selected={studentData.boersenEligible}
              style={{ backgroundColor: theme.colours.confirm }}
              value='yes'
              className="team-student-info-card--option-2">Yes</option>
            <option
              selected={!studentData.boersenEligible}
              style={{ backgroundColor: theme.colours.cancel }}
              value='no'
              className="team-student-info-card--option-3">No</option>
          </StyledToggleSelect> :
        <StyledBooleanStatus
          style={{ height: '25px' }}
          $toggled={studentData.boersenEligible}
          className="team-student-info-card--StyledBooleanStatus-1" />}
      </StyledVerticalMemberFieldDiv>
      <StyledVerticalMemberFieldDiv className="team-student-info-card--StyledVerticalMemberFieldDiv-5">
        <StyledLabelSpan
          $isEditing={isEditingCard}
          className="team-student-info-card--StyledLabelSpan-6">National Prizes:</StyledLabelSpan>
        {isEditingCard ?
          <StyledEditableTextArea
            onChange={(e) =>
              setStudentData((p) => ({ ...p, nationalPrizes: e.target.value }))
            }
            value={studentData.nationalPrizes}
            className="team-student-info-card--StyledEditableTextArea-1" />
          : <span>{studentData.nationalPrizes ? studentData.nationalPrizes : 'None'}</span>
        }
      </StyledVerticalMemberFieldDiv>
      <StyledVerticalMemberFieldDiv className="team-student-info-card--StyledVerticalMemberFieldDiv-6">
        <StyledLabelSpan
          $isEditing={isEditingCard}
          className="team-student-info-card--StyledLabelSpan-7">International Prizes:</StyledLabelSpan>
        {isEditingCard ?
          <StyledEditableTextArea
            onChange={(e) =>
              setStudentData((p) => ({
                ...p,
                internationalPrizes: e.target.value,
              }))
            }
            value={studentData.internationalPrizes}
            className="team-student-info-card--StyledEditableTextArea-2" />
          : <span>{studentData.internationalPrizes ? studentData.internationalPrizes : 'None'}</span>
        }
      </StyledVerticalMemberFieldDiv>
      <StyledMemberFieldDiv
        style={{ width: '75%' }}
        className="team-student-info-card--StyledMemberFieldDiv-1">
        <StyledLabelSpan
          $isEditing={isEditingCard}
          className="team-student-info-card--StyledLabelSpan-8">Codeforces Rating:</StyledLabelSpan>
        {isEditingCard ?
          <StyledEditableInput
            style={{ flex: 1 }}
            type="number"
            onChange={(e) => setStudentData((p) => ({ ...p, codeforcesRating: parseInt(e.target.value) }))}
            value={studentData.codeforcesRating}
            className="team-student-info-card--StyledEditableInput-0" />
          : <span>{studentData.codeforcesRating}</span>
        }
      </StyledMemberFieldDiv>
      <StyledVerticalMemberFieldDiv className="team-student-info-card--StyledVerticalMemberFieldDiv-7">
        <StyledLabelSpan
          $isEditing={isEditingCard}
          className="team-student-info-card--StyledLabelSpan-9">Past Regional:</StyledLabelSpan>
        {isEditingCard ?
          <StyledToggleSelect
            onChange={(e) =>
              setStudentData((p) => ({
                ...p,
                pastRegional: e.target.value === "true",
              }))
            }
            $toggled={studentData.pastRegional}
            className="team-student-info-card--StyledToggleSelect-2">
            <option
              selected={studentData.pastRegional}
              style={{ backgroundColor: theme.colours.confirm }}
              value="true"
              className="team-student-info-card--option-4">Yes</option>
            <option
              selected={!studentData.pastRegional}
              style={{ backgroundColor: theme.colours.cancel }}
              value="false"
              className="team-student-info-card--option-5">No</option>
          </StyledToggleSelect> :
        <StyledBooleanStatus
          style={{ height: '25px' }}
          $toggled={studentData.pastRegional}
          className="team-student-info-card--StyledBooleanStatus-2" />}
      </StyledVerticalMemberFieldDiv>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
        {!isEditingCard && isEditable && <ResponsiveActionButton style={{ height: '30px' }}
          onMouseDown={(e) => e.preventDefault()}
          handleClick={() => setPopupOpen(true)}
          handleClose={() => setPopupOpen(false)}
          handleSubmit={async () => handleSubmitTeamChange(student)}
          icon={<FaArrowRight />}
          label="Change Team"
          question={`What team should ${student.name} be in?`}
          actionType="primary"
        >
          <AdvancedDropdown
            optionsState={[teamOptions, setTeamOptions]}
            isExtendable={false}
            setCurrentSelected={setCurrentTeamOption}
          />
        </ResponsiveActionButton>}
      
        {isEdited && isEditingCard && <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
          <TransparentResponsiveButton actionType="error" label="Reset" isOpen={false} onClick={() => setStudentData(student)}
                icon={<RxReset />}
                style={{
                  backgroundColor: theme.colours.cancel,
                }} />
        </div>}
        
        {isEdited && <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
        <TransparentResponsiveButton actionType="confirm" label="Save Changes" isOpen={false} onClick={handleSaveEdit}
              icon={<FaSave />}
              style={{
                backgroundColor: theme.colours.confirm,
              }}
            />
          </div>
        }
      </div>
    </StyledMemberListItem>
  );
}