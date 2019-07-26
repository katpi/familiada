import { ActionReducer, Action } from "@ngrx/store";
import {
  AnswerActions,
  NEW_ANSWER,
  UPDATE_ANSWERS_STATE,
  CLEAR_ANSWERS
} from "./answer.actions";

export interface AnswersState {
  answers: number[];
}

const initialState = { answers: [] };

export function stateReducer(
  state = initialState,
  action: AnswerActions
): AnswersState {
  switch (action.type) {
    case NEW_ANSWER:
      return { answers: [...state.answers, action.payload.answerId] };
    case CLEAR_ANSWERS:
      return initialState;
    default:
      return state;
  }
}

export function persistStateReducer(_reducer: ActionReducer<AnswersState>) {
  const localStorageKey = "__answers";
  return (state: AnswersState | undefined, action: Action) => {
    if (state === undefined) {
      const persisted = localStorage.getItem(localStorageKey);
      return persisted ? JSON.parse(persisted) : _reducer(state, action);
    }
    const nextState = _reducer(state, action);
    localStorage.setItem(localStorageKey, JSON.stringify(nextState));
    return nextState;
  };
}

export function updateStateReducer(_reducer: ActionReducer<AnswersState>) {
  return (state: AnswersState | undefined, action: Action) => {
    if (action.type === UPDATE_ANSWERS_STATE) {
      return (<any>action).payload.AnswerId;
    }

    return _reducer(state, action);
  };
}

export function reducer(state: AnswersState | undefined, action: Action) {
  return updateStateReducer(persistStateReducer(stateReducer))(state, action);
}
