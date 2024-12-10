// GameTeam interface model

import {TeamMember} from "../TeamMember/TeamMember";

export interface GameTeam {
  id?: string;
  teamId: string;
  gameId: string;
  name: string;
  coachId: string;
  teamSize: number;
  teamStatus: GameTeamStatus;
  participants: TeamMember[];
  createdAt: string;
}

export enum GameTeamStatus {
  REGISTERED = "Registered",
  UNREGISTERED = "Unregistered",
}

// Model validation
export function validate(gameTeam: GameTeam): string {
  if (!gameTeam) {
    return "Game team is empty";
  }
  if (!gameTeam.teamId) {
    return "Game team id is empty";
  }
  if (!gameTeam.gameId) {
    return "Game id is empty";
  }
  if (!gameTeam.name) {
    return "Game team name is empty";
  }
  if (!gameTeam.coachId) {
    return "Game team coach id is empty";
  }
  if (!gameTeam.teamSize) {
    return "Game team size is empty";
  }
  if (!gameTeam.teamStatus) {
    return "Game team status is empty";
  }
  return "";
}