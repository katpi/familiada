import { Team } from "../enums/enums";

export const UPDATE_SCORES_STATE = "UpdateScoresState";

export const NEW_SCORE_STORAGE = "NewScoreStorage";

export const NEW_SCORE = "NewScore";
export function newScore(team: Team, score: number) {
  return {
    type: NEW_SCORE as typeof NEW_SCORE,
    payload: { team, score }
  };
}
export type ScoreActions = ReturnType<typeof newScore>;
