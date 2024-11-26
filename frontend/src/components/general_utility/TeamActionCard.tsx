import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaUserPlus, FaUsers, FaEdit, FaGlobe } from "react-icons/fa";
import { sendRequest } from "../../utility/request";
import { useParams } from "react-router-dom";
import { CompetitionSite } from "../../../shared_types/Competition/CompetitionSite";
import InvitePopup from "../../screens/student/subcomponents/InvitePopup";
import JoinPopup from "../../screens/student/subcomponents/JoinPopup";
import { SitePopupChain } from "../../screens/student/subcomponents/popups/SitePopupChain/SitePopupChain";
import { NamePopupChain } from "../../screens/student/subcomponents/popups/NamePopupChain/NamePopupChain";

const StyledActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5%;
  width: 100%;
  margin: 5% 5%;
  box-sizing: border-box;
  flex: 1 1 300px;
  flex-wrap: wrap;
`;

const StyledActionCard = styled.button<ActionCardProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1 1 200px;
  max-width: 280px;
  height: 100%;
  aspect-ratio: 1;
  background-color: ${({ theme, $actionType, $disabled }) =>
    $disabled ? theme.disabledBg : theme.teamProfile[$actionType]};
  border: ${({ $disabled, theme, $actionType }) =>
    $disabled
      ? "none"
      : `1px solid ${theme.teamProfile[`${$actionType}Border`]}`};
  border-radius: 12px;
  /* padding: 20px; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: transform 0.2s;
  box-sizing: border-box;

  &:hover {
    transform: ${({ $disabled }) =>
      $disabled ? "none" : "translate(2px, 2px)"};
  }
`;

const StyledCardIcon = styled.div<{ $disabled: boolean }>`
  font-size: 32px;
  margin-bottom: 10px;
  box-sizing: border-box;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colours.notifDark : theme.fonts.colour};
`;

const StyledCardText = styled.p<{ $disabled: boolean }>`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colours.notifDark : theme.fonts.colour};
  margin: 0;
  box-sizing: border-box;
`;

const StyledOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const StyledHeading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
  box-sizing: border-box;
`;

type ActionType = "invite" | "join" | "name" | "site";

const MAX_MEMBERS = 3;

interface ActionCardProps {
  $actionType: ActionType;
  $disabled: boolean;
}

interface TeamActionCardProps {
  numMembers: number;
  compId?: number;
}

/**
 * A React component for the Team Action tiles.
 *
 * @param {TeamActionCardProps} props - React TeamActionCardProps specified above
 * @returns {JSX.Element} - Web page component displaying the allowable team actions,
 * routing to other display elements
 */
export const TeamActionCard: React.FC<TeamActionCardProps> = ({
  numMembers,
}) => {
  const [modalOpen, setModalOpen] = useState<
    "invite" | "join" | "name" | "site" | null
  >(null);

  const [teamCode, setTeamCode] = useState("");
  const { compId } = useParams<{ compId: string }>();

  const [siteLocationOptions, setSiteLocationOptions] = useState([
    { value: "", label: "" },
  ]);

  const actions = [
    { type: "invite" as ActionType, icon: FaUserPlus, text: "Invite a Friend" },
    { type: "join" as ActionType, icon: FaUsers, text: "Join a Team" },
    { type: "name" as ActionType, icon: FaEdit, text: "Change Team Name" },
    { type: "site" as ActionType, icon: FaGlobe, text: "Change Team Site" },
  ];

  useEffect(() => {
    const fetchSiteLocations = async () => {
      const response = await sendRequest.get<{ sites: Array<CompetitionSite> }>(
        "/competition/sites",
        { compId }
      );
      const { sites } = response.data;
      setSiteLocationOptions(
        sites.map((site) => ({ value: String(site.id), label: site.name }))
      );
    };

    fetchSiteLocations();
  }, []);

  useEffect(() => {
    const fetchTeamCode = async () => {
      const response = await sendRequest.get<{ code: string }>(
        "/competition/team/invite_code",
        { compId }
      );
      const { code } = response.data;
      setTeamCode(code);
    };

    fetchTeamCode();
  }, []);

  // Determines whether an action should be disabled based on the number of members.
  const isDisabled = (actionType: ActionType) => {
    if (numMembers === 1) return actionType === "name" || actionType === "site";
    if (numMembers > 1 && numMembers < MAX_MEMBERS)
      return actionType === "join";
    if (numMembers >= MAX_MEMBERS)
      return actionType === "invite" || actionType === "join";
    return false;
  };

  return (
    <>
      <StyledActionsContainer className="team-action-card--StyledActionsContainer-0">
        {actions.map((action, index) => (
          <StyledActionCard className="team-action-card--StyledActionCard-0"
            key={index}
            onClick={() =>
              !isDisabled(action.type) && setModalOpen(action.type)
            }
            $actionType={action.type}
            $disabled={isDisabled(action.type)}
          >
            <StyledCardIcon className="team-action-card--StyledCardIcon-0"
              $disabled={isDisabled(action.type)}
              as={action.icon}
            />
            <StyledCardText className="team-action-card--StyledCardText-0" $disabled={isDisabled(action.type)}>
              {action.text}
            </StyledCardText>
          </StyledActionCard>
        ))}
      </StyledActionsContainer>

    <StyledOverlay
      $isOpen={modalOpen !== null}
      onClick={() => setModalOpen(null)}
      className="team-action-card--StyledOverlay-0" />

    {modalOpen === "invite" && (
      <InvitePopup
        heading={
          <StyledHeading className="team-action-card--StyledHeading-0">Copy and send your{"\nTeam Code to invite your"} {"\nmembers"}
          </StyledHeading>
        }
        text={teamCode}
        onClose={() => setModalOpen(null)}
      />
    )}

    {modalOpen === "join" && (
      <JoinPopup
        heading={
          <StyledHeading className="team-action-card--StyledHeading-1">Enter the details of the{"\nTeam you would like to join"}
          </StyledHeading>
        }
        onClose={() => setModalOpen(null)}
        currentTeamCode={teamCode}
      />
    )}

    {modalOpen === "site" && (
      <SitePopupChain
        siteOptionsState={[siteLocationOptions, setSiteLocationOptions]}
        handleClose={() => setModalOpen(null)}
      />
    )}

    {modalOpen === "name" && (
      <NamePopupChain handleClose={() => setModalOpen(null)} />
    )}
  </>);
};
