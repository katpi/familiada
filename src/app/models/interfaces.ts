import { FamiliadaEvent, GamePhase, GameState, Team } from '../enums/enums';

export interface FamiliadaSettings {
  team1Name: string;
  team2Name: string;
  questionsCount: number;
}

export interface FamiliadaQuestion {
  id: string;
  order: number;
  question: string;
  answers: FamiliadaResponse[];
}

export interface FamiliadaResponse {
  id: number;
  response: string;
  points: number;
}

export interface FamiliadaRoundState {
  questionId: number;
  roundNumber: number;
  responsesCount: number;
  answers: number[];
  phase: GamePhase;
  team: Team;
  sum: number;
  team1Wrong: number;
  team2Wrong: number;
  initialPhaseState: FamiliadaInitialPhaseState;
}

export interface FamiliadaScores {
  team1: number;
  team2: number;
}

export interface FamiliadaGameState {
  state: GameState;
}

export interface FamiliadaEventState {
  event: FamiliadaEvent;
}

export interface FamiliadaInitialPhaseState {
  firstClaiming: Team;
  firstClaimingPoints: number;
  secondClaimingPoints: number;
}
