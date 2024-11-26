import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Student } from "../../../../../shared_types/Competition/team/TeamDetails";
import { TeamActionCard } from "../../../../components/general_utility/TeamActionCard";
import { ProfileCard } from "../../subcomponents/ProfileCard/ProfileCard";
import { MarkdownDisplay } from "../../../general_components/MarkdownDisplay";

const StyledManageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  max-width: 100%;
  width: 100%;
  height: 100%;
  max-height: 70%;
  align-items: center;
`;

const StyledInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* max-width: 100; */
  flex: 1 1 300px;
`;

const StyledInfoCard = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 15px;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const StyledInfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInfoLabel = styled.h3`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin: 0;
  color: ${({ theme }) => theme.colours.primaryDark};
  margin-bottom: 5%;
`;

export const StyledInfoButton = styled.button`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  background-color: ${({ theme }) => theme.background};
  border: none;
  color: ${({ theme }) => theme.colours.primaryDark};
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
  margin: none;
  padding-left: 0px;
  box-sizing: border-box;

  &:hover {
    color: ${({ theme }) => theme.colours.primaryLight};
  }
`;

export const StyledInfoLink = styled.a`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.colours.primaryDark};
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colours.primaryLight};
  }
`;

const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const StyledModalContent = styled.div`
  position: relative;
  background: ${({ theme }) => theme.background};
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
  width: 80%;
  color: ${({ theme }) => theme.fonts.colour};
  box-sizing: border-box;
`;

const StyledCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.error};
  font-size: 24px;
  transition: color 0.3s;
  box-sizing: border-box;

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

/**
 * `TeamManage` is a React web page component that manages and displays information
 * for a competition team.It renders a `TeamActionCard` displaying the number of students
 * in the team, a `ProfileCard` for the team's coach, and a section for viewing competition
 * details and announcements. When the "see competition details" link is clicked,
 * a modal is opened to display the competition details and announcements in markdown
 * format.
 *
 * @returns {JSX.Element} - The rendered component showing team details and coach info.
 */
export const TeamManage: React.FC = () => {
  const { students, coach, announcements } = useOutletContext<{
    students: Student[];
    coach: {
      name: "";
      email: "";
      bio: "";
    };
    announcements: ""; // for coach to set specific comp details/announcements
  }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <StyledManageContainer className="team-manage--StyledManageContainer-0">
      <TeamActionCard
        numMembers={students.filter((s) => s.name !== null).length}
      />
      <StyledInfoContainer className="team-manage--StyledInfoContainer-0">
        <ProfileCard
          name={coach.name}
          email={coach.email}
          bio={coach.bio}
          isCoach={true}
        />
        <StyledInfoCard className="team-manage--StyledInfoCard-0">
          <StyledInfoContent className="team-manage--StyledInfoContent-0">
            <StyledInfoLabel className="team-manage--StyledInfoLabel-0">Competition Details and Announcements:</StyledInfoLabel>
            <StyledInfoLink onClick={handleOpenModal} className="team-manage--StyledInfoLink-0">see competition details →</StyledInfoLink>
          </StyledInfoContent>
        </StyledInfoCard>
      </StyledInfoContainer>
      {isModalOpen && (
        <StyledModalOverlay className="team-manage--StyledModalOverlay-0">
          <StyledModalContent className="team-manage--StyledModalContent-0">
            <StyledCloseButton
              onClick={handleCloseModal}
              className="team-manage--StyledCloseButton-0">
              <FaTimes />
            </StyledCloseButton>
            <MarkdownDisplay content={announcements} />
          </StyledModalContent>
        </StyledModalOverlay>
      )}
    </StyledManageContainer>
  );
};
