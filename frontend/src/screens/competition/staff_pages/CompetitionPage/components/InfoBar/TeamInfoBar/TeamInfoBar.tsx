/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { FaSave } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { TeamDetails } from "../../../../../../../../shared_types/Competition/team/TeamDetails";
import { ButtonConfiguration } from "../../../hooks/useCompetitionOutletContext";
import { sendRequest } from "../../../../../../../utility/request";
import {
  StyledInfoBarField,
  StyledMemberContainer,
  StyledMemberSpan,
  StyledMemberUl,
  StyledTeamContainer,
  StyledTeamDetailsLabelSpan,
  StyledTeamStatusDiv,
  StyledTitleDiv,
  StyledVerticalInfoBarField,
} from "./TeamInfoBar.styles";
import {
  StyledEditIcon,
  StyledEditIconButton,
} from "../../../../../../Account/Account.styles";
import {
  StyledEditableInput,
  TeamStudentInfoCard,
} from "../components/TeamStudentInfoCard";
import { AdvancedDropdown } from "../../../../../../../components/AdvancedDropdown/AdvancedDropdown";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";

interface TeamInfoBarProps extends InfoBarProps {
  teamDetails: TeamDetails;
  teamListState: [
    Array<TeamDetails>,
    React.Dispatch<React.SetStateAction<Array<TeamDetails>>>
  ];
  buttonConfigurationState: [
    ButtonConfiguration,
    React.Dispatch<React.SetStateAction<ButtonConfiguration>>
  ];
  siteOptionsState: [
    Array<{ value: string; label: string }>,
    React.Dispatch<
      React.SetStateAction<Array<{ value: string; label: string }>>
    >
  ];
  isEditable: boolean;
}

/**
 * A React component for displaying and editing team information.
 *
 * The `TeamInfoBar` component displays and manages the details of a team, including the team ID, name, coach, status, level, site, and seat.
 * It allows for editing these details if the `isEditable` prop is set to true. The component also features a list of students
 * associated with the team, with editable functionality for the team name, site, and seat.
 *
 * @param {TeamInfoBarProps} props - React TeamInfoBarProps specified above, where teamDetails containes the details of the team to display,
 * teamListState contains functions to update the list of teams, buttonConfigurationState alters the button configurations, siteOptionsState
 * contains the functions to manage the site options and isEditable determines whether the details can be edited.
 * @returns {JSX.Element} - A UI component that displays a teams's information and provides editing options.
 */
export const TeamInfoBar: FC<TeamInfoBarProps> = ({
  teamDetails,
  isOpenState: [isOpen, setIsOpen],
  teamListState: [teamList, setTeamList],
  buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
  siteOptionsState: [siteOptions, setSiteOptions],
  isEditable,
  ...props
}) => {
  const { compId } = useParams();
  const theme = useTheme();

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [teamData, setTeamData] = useState(teamDetails);
  const [currentSiteOption, setCurrentSiteOption] = useState({
    value: "",
    label: "",
  });
  const [isEdited, setIsEdited] = useState(false);

  // Updates the 'teamData' whenever the currentSitOption changes, ensuring
  // that 'teamData' reflects the selected site when editing team information
  useEffect(() => {
    if (!currentSiteOption.label || !currentSiteOption.value) {
      return;
    }
    setTeamData((p) => ({
      ...p,
      teamSite: currentSiteOption.label,
      siteId: parseInt(currentSiteOption.value),
    }));
  }, [currentSiteOption]);

  // Determines if there are any changes to 'teamData' compared to the original and
  // updates the Edit state accordingly
  useEffect(() => {
    if (
      Object.keys(teamData).every(
        (key) =>
          (teamData as Record<string, any>)[key] ===
          (teamDetails as Record<string, any>)[key]
      )
    ) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [teamData]);

  useEffect(() => {
    setTeamData(teamDetails);
  }, [teamDetails]);

  // Asynchronously handles the save operation after editing is complete.
  // It finds the index of the current team by matching 'teamId' and replaces the
  // old teamData with the edited version, sending a request to the backend to update
  // the information
  const handleSaveEdit = async () => {
    const currentTeamIndex = teamList.findIndex(
      (team) => team.teamId === teamDetails.teamId
    );
    setTeamList([
      ...teamList.slice(0, currentTeamIndex),
      teamData,
      ...teamList.slice(currentTeamIndex + 1),
    ]);

    await sendRequest.post("/competition/teams/update", {
      teamList: [teamData],
      compId,
    });
    setIsEdited(false);
  };

  return (
    <InfoBar isOpenState={[isOpen || isPopupOpen, setIsOpen]} {...props}>
      <StyledTeamContainer className="team-info-bar--StyledTeamContainer-0">
        <StyledInfoBarField className="team-info-bar--StyledInfoBarField-0">
          <StyledTeamDetailsLabelSpan className="team-info-bar--StyledTeamDetailsLabelSpan-0">Team Id:</StyledTeamDetailsLabelSpan>
          <span>{teamDetails.teamId}</span>
        </StyledInfoBarField>
        {isEditable && <StyledEditIconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setIsEditing((p) => !p) }}
          style={{ position: 'absolute', right: 0, top: 0 }}
          className="team-info-bar--StyledEditIconButton-0">
          <StyledEditIcon className="team-info-bar--StyledEditIcon-0" />
        </StyledEditIconButton>}
        <StyledTitleDiv
          $isOpen={isOpen || isPopupOpen}
          className="team-info-bar--StyledTitleDiv-0">
          {isEditing ?
          <StyledEditableInput
            value={teamData.teamName}
            onChange={(e) => setTeamData((p) => ({ ...p, teamName: e.target.value }))}
            style={{ width: '50%', height: '47px', fontSize: theme.fonts.fontSizes.title }}
            className="team-info-bar--StyledEditableInput-0" /> : <>{teamData.teamName}</>
          }
        </StyledTitleDiv>
        <StyledVerticalInfoBarField className="team-info-bar--StyledVerticalInfoBarField-0">
          <StyledTeamDetailsLabelSpan className="team-info-bar--StyledTeamDetailsLabelSpan-1">Coach:</StyledTeamDetailsLabelSpan>
          <span>{teamDetails.coach.name}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="team-info-bar--StyledVerticalInfoBarField-1">
          <StyledTeamDetailsLabelSpan className="team-info-bar--StyledTeamDetailsLabelSpan-2">Status:</StyledTeamDetailsLabelSpan>
          <StyledTeamStatusDiv
            $status={teamDetails.status}
            className="team-info-bar--StyledTeamStatusDiv-0">{teamDetails.status}</StyledTeamStatusDiv>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="team-info-bar--StyledVerticalInfoBarField-2">
          <StyledTeamDetailsLabelSpan className="team-info-bar--StyledTeamDetailsLabelSpan-3">Level:</StyledTeamDetailsLabelSpan>
          <span>{teamData.teamLevel}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="team-info-bar--StyledVerticalInfoBarField-3">
          <StyledTeamDetailsLabelSpan
            $isEditing={isEditing}
            className="team-info-bar--StyledTeamDetailsLabelSpan-4">Site:</StyledTeamDetailsLabelSpan>
          {isEditing ? 
          <div style={{ width: '100%' }}>
          <AdvancedDropdown
            isExtendable={false}
            style={{ height: '30px', borderRadius: '5px', width: '100%', marginBottom: '2px' }}
            defaultSearchTerm={teamData.teamSite}
            setCurrentSelected={setCurrentSiteOption}
            optionsState={[siteOptions, setSiteOptions]}
          /></div> :
          <span>{teamData.teamSite}</span>}
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField className="team-info-bar--StyledVerticalInfoBarField-4">
          <StyledTeamDetailsLabelSpan
            $isEditing={isEditing}
            className="team-info-bar--StyledTeamDetailsLabelSpan-5">Seat:</StyledTeamDetailsLabelSpan>
          {isEditing ?
          <StyledEditableInput
            value={teamData.teamSeat}
            onChange={(e) => setTeamData((p) => ({ ...p, teamSeat: e.target.value }))}
            className="team-info-bar--StyledEditableInput-1" /> :
          <span>{teamData.teamSeat}</span>}
        </StyledVerticalInfoBarField>
        <br/>
        {isEdited && <div style={{ width: '100%', height: '30px', display: 'flex', maxWidth: '300px' }}>
          <TransparentResponsiveButton actionType="error" label="Reset" isOpen={false} onClick={() => setTeamData(teamDetails)}
              icon={<RxReset />}
              style={{
                backgroundColor: theme.colours.cancel,
              }}
            />
            <TransparentResponsiveButton
              actionType="confirm"
              label="Save Changes"
              isOpen={false}
              onClick={handleSaveEdit}
              icon={<FaSave />}
              style={{
                backgroundColor: theme.colours.confirm,
              }} />

        </div>}
        <StyledMemberSpan className="team-info-bar--StyledMemberSpan-0">Members</StyledMemberSpan>
      </StyledTeamContainer>
      
      <StyledMemberContainer className="team-info-bar--StyledMemberContainer-0">
        <StyledInfoBarField className="team-info-bar--StyledInfoBarField-1">
          <StyledMemberUl className="team-info-bar--StyledMemberUl-0">
            {teamDetails.students.map((student) => {
              return (
                <TeamStudentInfoCard
                  key={`${student.userId}`}
                  student={student}
                  teamDetails={teamDetails}
                  buttonConfigurationState={[
                    buttonConfiguration,
                    setButtonConfiguration,
                  ]}
                  teamListState={[teamList, setTeamList]}
                  popupOpenState={[isPopupOpen, setPopupOpen]}
                  isEditable={isEditable}
                />
              );
            })}
          </StyledMemberUl>
        </StyledInfoBarField>
      </StyledMemberContainer>
    </InfoBar>
  );
}
