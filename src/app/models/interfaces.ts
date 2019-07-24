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
