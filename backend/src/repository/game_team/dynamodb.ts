import AWS from "aws-sdk";
import { GameTeam, GameTeamStatus } from "../../model/game_team";
import { Team } from "../../model/team_model";
import { Game } from "../../model/game_model";
import { TeamMember } from "../../model/team_member_model";
import { GameTeamRepository } from "../game_team_repository";
import { DDB_GAME_TEAMS_TABLE_NAME } from "../../config/dynamodb";

export class DynamoDBGameTeamRepository implements GameTeamRepository {
    private readonly dynamoDB: AWS.DynamoDB;

    constructor(dynamoDB: AWS.DynamoDB) {
        this.dynamoDB = new AWS.DynamoDB();
    }

    // Join a gameTeam in ddb
    async joinGameTeam(team: Team, game: Game, teamMember: TeamMember): Promise<GameTeam | null> {
      const currentDate = new Date(Date.now());
      const gameTeam : GameTeam = {
          id: currentDate.getTime().toString(),
          teamId: team.id,
          gameId: game.id,
          name: teamMember.preferredName,
          coachId: teamMember.uuid,
          teamSize: 20,
          teamStatus: GameTeamStatus.UNREGISTERED,
          participants: [teamMember],
          createdAt: currentDate.getTime().toString(),
      }

      const params = {
      TableName: DDB_GAME_TEAMS_TABLE_NAME,
      Item: {
          "tid": { S: gameTeam.teamId },
          "sk": { S: await this.generateGameTeamSortKey(gameTeam.id) },
          "gid": { S: gameTeam.gameId },
          "na": { S: gameTeam.name || "" },
          "cid": { S: gameTeam.coachId },
          "ts": { N: gameTeam.teamSize.toString() },
          "sts": { S: gameTeam.teamStatus },
          "pts": { S: JSON.stringify(gameTeam.participants) },
          "ca": { S: gameTeam.createdAt }
      },
      ConditionExpression: "attribute_not_exists(sk)"
      };

      try {
          await this.dynamoDB.putItem(params).promise();
          return gameTeam;
      } catch (err) {
          console.error("Error creating game team in DynamoDB:", err);
          throw err;
      }
    }

    // Add this helper method to generate sort key for game team
    async generateGameTeamSortKey(id: string): Promise<string> {
      return `game_team#${id}`;
    }
}