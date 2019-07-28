export interface FamiliadaSettings {
  team1Name: string;
  team2Name: string;
  questionsCount: number;
}

export interface FamiliadaQuestions {
  questions: FamiliadaQuestion[];
}

export interface FamiliadaQuestion {
  id: number;
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
  responsesCount: number;
  answers: number[];
  phase: string;
  team: string;
  sum: number;
  wrong: number;
  initialPhaseState: InitialPhaseState;
}

export interface Scores {
  team1: number;
  team2: number;
}

export interface GameState {
  state: string;
}

export interface InitialPhaseState {
  firstClaiming: string;
  firstClaimingPoints: number;
  secondClaimingPoints: number;
}
