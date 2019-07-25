export const UPDATE_QUESTIONS_STATE = "UpdateQuestionsState";

export const NEW_QUESTION_STORAGE = "NewQuestionStorage";

export const NEW_QUESTION = "NewQuestion";
export function newQuestion(state: { questionId: number }) {
  return {
    type: NEW_QUESTION as typeof NEW_QUESTION,
    payload: { questionId: state.questionId + 1 }
  };
}

export type QuestionActions = ReturnType<typeof newQuestion>;
