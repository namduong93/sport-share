import { FC, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";
import { StudentInfo } from "../../../../../shared_types/Competition/student/StudentInfo";
import { sendRequest } from "../../../../utility/request";
import { ProfileCard } from "../../subcomponents/ProfileCard/ProfileCard";
import { EditCompUserDetails } from "../../subcomponents/EditCompUserDetails/EditCompUserDetails";
import { backendURL } from "../../../../../config/backendURLConfig";


const StyledDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  /* height: fit-content; */
  /* min-height: fit-content; */
  align-items: flex-start;
  margin-top: 10px;
  /* max-height: 60%; */
  column-gap: 5%;
  row-gap: 20px;
  flex-wrap: wrap;
`;

const StyledTeamDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  max-height: 600px;
  height: 100%;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  padding: 15px;
  box-sizing: border-box;
  min-width: 200px;
  flex: 1 1 250px;
`;

const StyledTeamInfo = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1;
  cursor: default;
`;

const StyledTeamLabel = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.regular};
  color: ${({ theme }) => theme.colours.primaryDark};
`;

const StyledTeamField = styled.p`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
`;

const StyledStudentsContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1 1 500px;
`;

/**
 * `TeamDetails` is a React web page component that displays the details of a competition team,
 * including the team's name, site location, seat, and level. It also lists all the students in the team
 * along with their details in the form of `ProfileCard` components. Clicking Edit,
 * the component displays an editable form (`EditCompUserDetails`) to allow modification
 * of the student's information.
 *
 * @returns {JSX.Element} - A component that renders the team details and student profiles.
 */
export const TeamDetails: FC = () => {
  const { teamName, teamSite, teamSeat, teamLevel, students } =
    useOutletContext<{
      teamName: string;
      teamSite: string;
      teamSeat: string;
      teamLevel: "";
      students: StudentInfo[];
    }>();
  const { compId } = useParams();
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(
    {} as StudentInfo
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await sendRequest.get<{ studentDetails: StudentInfo }>(
          "/competition/student/details",
          { compId }
        );
        setStudentInfo(response.data.studentDetails);
        console.log("Student info fetched", response.data);
      } catch (err) {
        console.log("Error fetching student info", err);
      }
    };
    fetchStudentInfo();
  }, []);

  const handleSave = async (studentDetails: StudentInfo): Promise<boolean> => {
    try {
      setStudentInfo(studentDetails);
      await sendRequest.put("/competition/student/details", {
        compId,
        studentDetails,
      });
      return true;
    } catch (err) {
      console.error("Error updating student info:", err);
      return false;
    }
  };

  return (
    <StyledDetailsContainer className="team-details--StyledDetailsContainer-0">
      <StyledTeamDetailsContainer className="team-details--StyledTeamDetailsContainer-0">
        <StyledTeamInfo className="team-details--StyledTeamInfo-0">
          <div>
            <StyledTeamLabel className="team-details--StyledTeamLabel-0">Team Name:</StyledTeamLabel>
            <StyledTeamField className="team-details--StyledTeamField-0">{teamName}</StyledTeamField>
          </div>
          <div>
            <StyledTeamLabel className="team-details--StyledTeamLabel-1">Site Location:</StyledTeamLabel>
            <StyledTeamField className="team-details--StyledTeamField-1">{teamSite}</StyledTeamField>
          </div>
          <div>
            <StyledTeamLabel className="team-details--StyledTeamLabel-2">Seat:</StyledTeamLabel>
            <StyledTeamField className="team-details--StyledTeamField-2">{teamSeat}</StyledTeamField>
          </div>
          <div>
            <StyledTeamLabel className="team-details--StyledTeamLabel-3">Level:</StyledTeamLabel>
            <StyledTeamField className="team-details--StyledTeamField-3">{teamLevel}</StyledTeamField>
          </div>
        </StyledTeamInfo>
      </StyledTeamDetailsContainer>
      <StyledStudentsContainer className="team-details--StyledStudentsContainer-0">
        {students.map((student, index) => (
          <ProfileCard
            key={`student-${index}`}
            name={student.preferredName}
            email={student.email}
            bio={student.bio}
            image={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
            preferredContact={student.preferredContact}
            isFirst={index === 0}
            onEdit={() => setIsEditing(true)}
          />
        ))}
      </StyledStudentsContainer>
      {isEditing && (
        <EditCompUserDetails
          student={studentInfo}
          onSubmit={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </StyledDetailsContainer>
  );
};
