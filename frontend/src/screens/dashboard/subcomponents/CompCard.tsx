import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import {
  StyledCardBottom,
  StyledCardHeader,
  StyledCardMiddle,
  StyledCardText,
  StyledCardTop,
  StyledCompCardContainer,
  StyledCompHeader,
  StyledCountdown,
  StyledProgress,
  StyledProgressBar,
  StyledRole,
  StyledRoleContainer,
} from "./CompCard.styles";
import { sendRequest } from "../../../utility/request";
import { GameAttendee, gameVotes } from "../../../../shared_types/Game/Game";
import { DEFAULT_TEAM_ID } from "../../../../shared_types/Team/Team";

interface CardProps {
  gameName: string;
  location: string;
  gameDate: string;
  gameId: string;
  gameCreationDate: string;
  estimatedExpense: string;
};

/**
 * A React component for displaying information about a competition.
 *
 * The `CompCard` component displays a competition card with key details, such as
 * the competition name, location, date, and the user's roles. It also includes
 * a countdown to the competition date and a progress bar indicating how much time has
 * passed since the competition was created.
 *
 * @param {CardProps} props - React CardProps specified above
 * @returns {JSX.Element} - A card displaying the competition details, a countdown to the competition,
 * and a progress bar showing the time elapsed since creation.
 */
export const CompCard: FC<CardProps> = ({
  gameName,
  location,
  gameDate,
  gameId,
  gameCreationDate,
  estimatedExpense,
}) => {
  const navigate = useNavigate();
  const gameDateFormatted = format(new Date(Number(gameDate) * 1000), "MMMM yyyy");
  const today = new Date(); // Today's date
  const daysRemaining = differenceInDays(new Date(gameDate), today);

  const compCreationDateFormatted = new Date(gameCreationDate);
  let totalDays = differenceInDays(
    new Date(gameDate),
    compCreationDateFormatted
  );
  totalDays = Math.max(totalDays, daysRemaining);

  const progressWidth =
    totalDays > 0 ? ((totalDays - daysRemaining) / totalDays) * 100 : 100;

  const handleClick = async () => {
    const getTeamInfo = async () => {
      const response = await sendRequest.get(`/teams/${DEFAULT_TEAM_ID}/games/${gameId}/attended`);
      if(response.data === null) {
        throw new Error("Game not found");
      }
      console.log(response.data);
      if(response.data === false) {
        navigate(`/game/register/` + gameId);
      } else {
        navigate(`/game/${gameId}`);
      }
    };
    getTeamInfo();
  };
    
  return (
    <StyledCompCardContainer
      onClick={handleClick}
      className="comp-card--StyledCompCardContainer-0">
      <StyledCardHeader className="comp-card--StyledCardHeader-0">
        <StyledCardTop className="comp-card--StyledCardTop-0">
          <StyledCompHeader className="comp-card--StyledCompHeader-0">
            <h2>{gameName}</h2>
          </StyledCompHeader>
        </StyledCardTop>
      </StyledCardHeader>
      <StyledCardMiddle className="comp-card--StyledCardMiddle-0">
        <StyledCardText className="comp-card--StyledCardText-0">{location}</StyledCardText>
        <StyledCardText className="comp-card--StyledCardText-1">{gameDateFormatted}</StyledCardText>
      </StyledCardMiddle>
      <StyledCardBottom className="comp-card--StyledCardBottom-0">
        <StyledRoleContainer className="comp-card--StyledRoleContainer-0">
          <StyledRole className="comp-card--StyledRole-0">{estimatedExpense}</StyledRole>
        </StyledRoleContainer>
        <StyledCountdown className="comp-card--StyledCountdown-0">{daysRemaining > 0 ? `${daysRemaining} days to go!` : "Game ended!"}</StyledCountdown>
      </StyledCardBottom>
      <StyledProgressBar className="comp-card--StyledProgressBar-0">
        <StyledProgress $width={progressWidth} className="comp-card--StyledProgress-0" />
      </StyledProgressBar>
    </StyledCompCardContainer>
  );
};
