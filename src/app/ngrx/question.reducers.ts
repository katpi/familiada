import { ActionReducer, Action } from "@ngrx/store";
import {
  QuestionActions,
  NEW_QUESTION,
  UPDATE_QUESTIONS_STATE
} from "./question.actions";

export interface QuestionState {
  questionId: number;
}

const initialState = { questionId: 0 };

export function stateReducer(
  state = initialState,
  action: QuestionActions
): QuestionState {
  switch (action.type) {
    case NEW_QUESTION:
      return action.payload;
    default:
      return state;
  }
}

export function persistStateReducer(_reducer: ActionReducer<QuestionState>) {
  const localStorageKey = "__questions";
  return (state: QuestionState | undefined, action: Action) => {
    if (state === undefined) {
      const persisted = localStorage.getItem(localStorageKey);
      return persisted ? JSON.parse(persisted) : _reducer(state, action);
    }
    const nextState = _reducer(state, action);
    localStorage.setItem(localStorageKey, JSON.stringify(nextState));
    return nextState;
  };
}

export function updateStateReducer(_reducer: ActionReducer<QuestionState>) {
  return (state: QuestionState | undefined, action: Action) => {
    if (action.type === UPDATE_QUESTIONS_STATE) {
      return (<any>action).payload.questionId;
    }

    return _reducer(state, action);
  };
}

export function reducer(state: QuestionState | undefined, action: Action) {
  return updateStateReducer(persistStateReducer(stateReducer))(state, action);
}
