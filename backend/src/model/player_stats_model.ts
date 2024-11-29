// Player stat interface model
export interface PlayerStats {

    preferredPosition: Array<Position>;
    defense: number;
    attack: number;
    badmintonRanking: number;
  }
  
  export enum Position {
    GOALKEEPER = "GK",
    DEFENDER = "DF",
    MIDFIELDER = "MD",
    ATTACKER = "AT",
  
    FORWARD = "FW",
    BACKWARD = "BW",
  }
  
  export enum ScoreRange {
    MIN = 0,
    MAX = 100
  }
  
  // Model validation
  export function validatePlayerStats(playerStats: PlayerStats): string {
    if (!playerStats.preferredPosition) {
        return "preferred position is required";
    }
    else {
        const validPositions = Object.values(Position);
        if (!playerStats.preferredPosition.every(position => validPositions.includes(position))) {
            return "unknown position";
        }
    }
  
    const numericFields: Array<keyof PlayerStats> = [
        "defense", "attack"
    ];
  
    // Validating the numeric score fields
    for (const field of numericFields) {
        const value = playerStats[field];
        if (typeof value !== 'number' || value < ScoreRange.MIN || value > ScoreRange.MAX) {
            return `${field.charAt(0).toUpperCase() + field.slice(1)} score is required and must be between ${ScoreRange.MIN} and ${ScoreRange.MAX}`;
        }
    }
  
    return "";
  }