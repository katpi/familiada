export interface FamiliadaQuestion {
  id: number;
  question: string;
  answers: FamiliadaResponse[]
}

export interface FamiliadaResponse {
  id: number;
  response: string;
  points: number;
}

export interface QuestionState {
  questionId: number;
}

export interface AnswersState {
  answers: number[];
}

export interface ScoresState {
  team1: number;
  team2: number;
}

export interface TeamState {
  team: string
}