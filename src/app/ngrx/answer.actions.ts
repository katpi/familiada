export const UPDATE_ANSWERS_STATE = "UpdateAnswersState";

export const NEW_ANSWER_STORAGE = "NewAnswerStorage";

export const NEW_ANSWER = "NewAnswer";
export function claimAnswer(state: { answerId: number }) {
  return {
    type: NEW_ANSWER as typeof NEW_ANSWER,
    payload: state
  };
}

export const CLEAR_ANSWERS = "ClearAnswers";
export function clearAnswers() {
  return {
    type: CLEAR_ANSWERS as typeof CLEAR_ANSWERS,
    payload: null
  };
}

export type AnswerActions =
| ReturnType<typeof claimAnswer>
| ReturnType<typeof clearAnswers>;
