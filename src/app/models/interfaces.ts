import { FamiliadaEvent } from '../enums/enums';

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

export interface RoundState {
  questionId: number;
  roundNumber: number;
  responsesCount: number;
  answers: number[];
  phase: string;
  team: string;
  sum: number;
  team1Wrong: number;
  team2Wrong: number;
  initialPhaseState: InitialPhaseState;
}

export interface Scores {
  team1: number;
  team2: number;
}

export interface GameState {
  state: string;
}

export interface EventState {
  event: FamiliadaEvent;
}

export interface InitialPhaseState {
  firstClaiming: string;
  firstClaimingPoints: number;
  secondClaimingPoints: number;
}
