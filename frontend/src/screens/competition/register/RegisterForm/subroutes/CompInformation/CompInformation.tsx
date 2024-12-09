import { CompetitionInformation as CompetitionDetails } from "../../../../../../../shared_types/Competition/CompetitionDetails";

import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sendRequest } from "../../../../../../utility/request";
import { StyledFlexBackground } from "../../../../../../components/general_utility/Background";
import { CompRegistrationProgressBar } from "../../../../../../components/progress_bar/ProgressBar";
import {
  StyledBoxNameContainer,
  StyledBoxPlayerContainer,
  StyledButton,
  StyledButtonContainer,
  StyledContainer,
  StyledContentContainer,
  StyledGameDetailsContainer,
  StyledPlayerStatus,
  StyledTitle,
} from "./CompInformation.styles";
import { MarkdownDisplay } from "../../../../../general_components/MarkdownDisplay";
import { Game, GameAttendee, gameVotes } from "../../../../../../../shared_types/Game/Game";
import { DEFAULT_TEAM_ID } from "../../../../../../../shared_types/Team/Team";
import { StyledFormLabel, StyledText } from "../CompIndividualInput/CompIndividualInput.styles";
import { format } from "path";

export const defaultCompInformation = `
Welcome you to the Game!
  `;

export const formatDateTime = (timestamp: number | undefined): string => {
  if (!timestamp) return '';
  
  const date = new Date(Number(timestamp) * 1000);
  const day = date.getDate();
  const month = date.toLocaleString('en-AU', { month: 'long' });
  const weekday = date.toLocaleString('en-AU', { weekday: 'long' });
  const time = date.toLocaleString('en-AU', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false,
    timeZone: 'Australia/Sydney'
  });
  
  // Add ordinal suffix to day (1st, 2nd, 3rd, etc.)
  const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${getOrdinal(day)} ${month}, ${weekday} at ${time}`;
};

/**
 * A React web page form component displaying the background information for a competition
 *
 * @returns {JSX.Element} - A form UI containing competition information
 */
export const CompetitionInformation: FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId?: string }>();
  const [game, setGame] = useState<Game>();
  const [attendees, setAttendees] = useState<GameAttendee[]>([]);

  useEffect(() => {
    const fetchCompInformation = async () => {
      try {
        const response = await sendRequest.get<Game | null>(`/teams/${DEFAULT_TEAM_ID}/games/${gameId}`);
        if(response.data === null) {
          throw new Error("Game not found");
        }
        else {
          setGame(response.data);
        }
      } catch (err: unknown) {
        console.error(err);
      }
    };

    const fetchGameAttendees = async () => {
      try {
        const response = await sendRequest.get<GameAttendee[]>(`/teams/${DEFAULT_TEAM_ID}/games/${gameId}/attendees/${gameVotes.YES}`);
        if(response.data === null) {
          throw new Error("Attendees not found");
        } else {
          setAttendees(response.data);
        }
      } catch (err: unknown) {
        console.error(err);
      }
    };

    fetchCompInformation();
    fetchGameAttendees();
  }, [gameId]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await sendRequest.post<string>(`/teams/${DEFAULT_TEAM_ID}/games/${gameId}/vote`, { vote: "yes" });
      navigate("/dashboard");
    }
    catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <StyledFlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      className="comp-information--StyledFlexBackground-0">
      <CompRegistrationProgressBar progressNumber={0} />
      <StyledContainer className="comp-information--StyledContainer-0">
        <StyledContentContainer className="comp-information--StyledContentContainer-0">
          <StyledTitle className="comp-information--StyledTitle-0">Game Details</StyledTitle>
          <StyledGameDetailsContainer className="comp-information--StyledGameDetailsContainer-0">
            <StyledFormLabel 
              className="comp-individual-input--StyledFormLabel-0" 
              style={{ display: 'inline' }}
            >
              Location: <StyledText 
                className="comp-individual-input--StyledText-0" 
                style={{ display: 'inline' }}
              >
                {game?.location}
              </StyledText>
            </StyledFormLabel>
            <StyledFormLabel 
              className="comp-individual-input--StyledFormLabel-0" 
              style={{ display: 'inline' }}
            >
              Capacity: <StyledText 
                className="comp-individual-input--StyledText-0" 
                style={{ display: 'inline' }}
              >
                {game?.minAttendance} - {game?.maxAttendance} members
              </StyledText>
            </StyledFormLabel>
            <StyledFormLabel 
              className="comp-individual-input--StyledFormLabel-0" 
              style={{ display: 'inline' }}
            >
              Time: <StyledText 
                className="comp-individual-input--StyledText-0" 
                style={{ display: 'inline' }}
              >
                {formatDateTime(Number(game?.startTime))}
              </StyledText>
            </StyledFormLabel>
            <StyledFormLabel 
              className="comp-individual-input--StyledFormLabel-0" 
              style={{ display: 'inline' }}
            >
              Duration: <StyledText 
                className="comp-individual-input--StyledText-0" 
                style={{ display: 'inline' }}
              >
                {game?.duration}
              </StyledText>
            </StyledFormLabel>
            <StyledFormLabel 
              className="comp-individual-input--StyledFormLabel-0" 
              style={{ display: 'inline' }}
            >
              Vote close on: <StyledText 
                className="comp-individual-input--StyledText-0" 
                style={{ display: 'inline' }}
              >
                {formatDateTime(Number(game?.deadlineForRegistration))}
              </StyledText>
            </StyledFormLabel>
            <StyledFormLabel 
              className="comp-individual-input--StyledFormLabel-0" 
              style={{ display: 'inline' }}
            >
              Cost: <StyledText 
                className="comp-individual-input--StyledText-0" 
                style={{ display: 'inline' }}
              >
                {game?.estimatedExpense}
              </StyledText>
            </StyledFormLabel>
          </StyledGameDetailsContainer>

          <MarkdownDisplay content={game?.description !== null ? game?.description : defaultCompInformation} />

          <StyledTitle className="comp-information--StyledTitle-1">Players</StyledTitle>
          {attendees?.map((attendee, index) => (
            <StyledBoxPlayerContainer 
              key={`player-${index}`} 
              className="comp-information--StyledBoxPlayerContainer-0"
            >
              <StyledBoxNameContainer className="comp-information--StyledBoxNameContainer-0">
                {attendee.preferredName}
              </StyledBoxNameContainer>
              <StyledPlayerStatus $status="going">Going</StyledPlayerStatus>
            </StyledBoxPlayerContainer>
          ))}
          <StyledBoxPlayerContainer 
              key={`player-notgoing`}
              className="comp-information--StyledBoxPlayerContainer-0"
            >
            <StyledBoxNameContainer className="comp-information--StyledBoxNameContainer-0">
              Minh Truong
            </StyledBoxNameContainer>
            <StyledPlayerStatus $status="notgoing">Not Going</StyledPlayerStatus>
          </StyledBoxPlayerContainer>
          <StyledBoxPlayerContainer 
              key={`player-maybe`}
              className="comp-information--StyledBoxPlayerContainer-0"
            >
            <StyledBoxNameContainer className="comp-information--StyledBoxNameContainer-0">
              Joe Nguyen
            </StyledBoxNameContainer>
            <StyledPlayerStatus $status="maybe">Maybe</StyledPlayerStatus>
          </StyledBoxPlayerContainer>
          <StyledButtonContainer className="comp-information--StyledButtonContainer-0">
            <StyledButton onClick={handleBack} className="comp-information--StyledButton-0">Back</StyledButton>
            <StyledButton onClick={handleNext} className="comp-information--StyledButton-1">Join Game</StyledButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};
