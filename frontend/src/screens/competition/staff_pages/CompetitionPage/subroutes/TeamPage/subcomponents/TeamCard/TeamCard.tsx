import { PanInfo } from "framer-motion";
import {
  Student,
  TeamDetails,
} from "../../../../../../../../../shared_types/Competition/team/TeamDetails";
import { DragEndEvent } from "../../TeamPage";
import { ButtonConfiguration } from "../../../../hooks/useCompetitionOutletContext";
import { CompetitionRole } from "../../../../../../../../../shared_types/Competition/CompetitionRole";
import { FC, useState } from "react";
import {
  StyledCardHeaderDiv,
  StyledRedTeamNameAlert,
  StyledHoverDiv,
  StyledTeamLevelDiv,
  StyledTeamMatesContainerDiv,
  StyledTeamMemberMotionDiv,
  StyledTeamNameApprovalDiv,
  StyledTitleSpan,
} from "./TeamCard.styles";
import { TeamCardMember } from "./subcomponents/TeamCardMember/TeamCardMember";
import { ApproveRadio } from "./subcomponents/ApproveRadio/ApproveRadio";
import { ApproveNameRadios } from "./subcomponents/ApproveNameRadios/ApproveNameRadios";
import { TeamInfoBar } from "../../../../components/InfoBar/TeamInfoBar/TeamInfoBar";

export enum Member {
  name = 0,
  siteId = 1,
  ICPCEligible = 2,
  level = 3,
  boersenEligible = 4,
  isRemote = 5,
};

export const enum RadioOption {
  Neither = "Neither",
  Check = "Check",
  Cross = "Cross",
};

export const DRAG_ANIMATION_DURATION = 0.2;

interface TeamCardProps extends React.HTMLAttributes<HTMLDivElement> {
  teamDetails: TeamDetails;
  isEditingStatus: boolean;
  teamIdsState: [number[], React.Dispatch<React.SetStateAction<number[]>>];
  rejectedTeamIdsState: [
    number[],
    React.Dispatch<React.SetStateAction<number[]>>
  ];
  isEditingNameStatus: boolean;
  isDraggingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  handleDragDropCard?: (
    event: DragEndEvent,
    info: PanInfo,
    member: Student,
    currentTeamId: number
  ) => void;
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
  roles: Array<CompetitionRole>;
}

/**
 * A React component that displays detailed information about a team, including team members,
 * their level, and their approval status. It supports drag-and-drop functionality for team members
 * and allows for editing of team status and name approval based on user roles.
 *
 * @param {TeamCardProps} props - React TeamCardProps specified above
 * @returns {JSX.Element} - A team card component displaying the team information and allowing status/name edits.
 */
export const TeamCard: FC<TeamCardProps> = ({
  teamDetails,
  isEditingStatus = false,
  teamListState: [teamList, setTeamlist],
  teamIdsState: [, setTeamIds],
  rejectedTeamIdsState: [, setRejectedTeamIds],
  buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
  isEditingNameStatus = false,
  isDraggingState: [isDragging, setIsDragging],
  handleDragDropCard = () => {},
  siteOptionsState: [siteOptions, setSiteOptions],
  roles,
  ...props
}) => {
  const [status, ] = useState(teamDetails.status);
  const colorMap = {
    Pending: "#F48385",
    Unregistered: "#FDD386",
    Registered: "#8BDFA5",
  };

  const toggleCurrentId = () => {
    setTeamIds((pTeamIds) => {
      const index = pTeamIds.indexOf(teamDetails.teamId);
      if (index < 0) {
        // if the team isn't in the list yet then add it
        return [...pTeamIds, teamDetails.teamId];
      }

      // otherwise remove it
      return [...pTeamIds.slice(0, index), ...pTeamIds.slice(index + 1)];
    });
  };

  const isEditThisCard = isEditingStatus && teamDetails.status === "Pending";
  const isEditNameThisCard =
    isEditingNameStatus && teamDetails.teamNameApproved === false;

  const [infoBarOpen, setInfoBarOpen] = useState(false);

  const isEditable = !(
    roles.includes(CompetitionRole.SiteCoordinator) &&
    !roles.includes(CompetitionRole.Coach) &&
    !roles.includes(CompetitionRole.Admin)
  );
  const levelChar = teamDetails.teamLevel.slice(-1);
  return <>
  <TeamInfoBar
    buttonConfigurationState={[buttonConfiguration, setButtonConfiguration]}
    teamListState={[teamList, setTeamlist]}
    isOpenState={[infoBarOpen, setInfoBarOpen]}
    teamDetails={teamDetails}
    siteOptionsState={[siteOptions, setSiteOptions]}
    isEditable={isEditable}
  />
  <StyledHoverDiv
    className="team-card-cell"
    $isDragging={isDragging}
    $isEditingStatus={isEditThisCard}
    $isEditingNameStatus={isEditNameThisCard}
    $numMembers={teamDetails.students.length}
    onDoubleClick={() => setInfoBarOpen((p) => !p)}
    {...props}
    >
    {!isEditNameThisCard &&
    <>
      <StyledCardHeaderDiv
        $statusColor={colorMap[status]}
        className="team-card--StyledCardHeaderDiv-0">
        <StyledTitleSpan className="team-card--StyledTitleSpan-0">{teamDetails.teamName}</StyledTitleSpan>
        {!teamDetails.teamNameApproved && <StyledRedTeamNameAlert className="team-card--StyledRedTeamNameAlert-0" />}
        <StyledTeamLevelDiv $levelChar={levelChar} className="team-card--StyledTeamLevelDiv-0">
          <span>{levelChar}</span>
        </StyledTeamLevelDiv>
      </StyledCardHeaderDiv>
  
        <StyledTeamMatesContainerDiv className="team-card--StyledTeamMatesContainerDiv-0">
          {teamDetails.students.map((member) => (
            <StyledTeamMemberMotionDiv
              key={`${member.userId}`}
              layoutId={`${member.userId}`}
              layout
              transition={{
                type: isDragging ? 'spring' : false,
                duration: DRAG_ANIMATION_DURATION
              }}
              // animate={{ opacity: isDragging ? 0.8 : 1 }}
              className="team-member-cell"
              drag={isEditable}
              $isDraggable={isEditable}
              dragElastic={1}
              dragConstraints={{left: 0, top: 0, right: 0, bottom: 0}}
              onDragStart={() => setIsDragging(true)}
              onDragTransitionEnd={() => setIsDragging(false)}
              onDragEnd={(event, info) => handleDragDropCard(event, info, member, teamDetails.teamId)}
              >
              <TeamCardMember memberName={member.name} level={member.level} />
            </StyledTeamMemberMotionDiv>
          ))}
          {isEditThisCard &&
            <ApproveRadio onClick={toggleCurrentId}>
              Approve
            </ApproveRadio>
          }
        </StyledTeamMatesContainerDiv>
  </>}
    {isEditNameThisCard &&
      <StyledTeamNameApprovalDiv className="team-card--StyledTeamNameApprovalDiv-0">
        <StyledTitleSpan
          style={{ margin: '0', marginBottom: '20px' }}
          className="team-card--StyledTitleSpan-1">{teamDetails.teamName}</StyledTitleSpan>
        <ApproveNameRadios
          setTeamIds={setTeamIds}
          setRejectedTeamIds={setRejectedTeamIds}
          teamId={teamDetails.teamId}
        />
      </StyledTeamNameApprovalDiv>
    }
  </StyledHoverDiv>
  </>;
}
