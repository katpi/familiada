import { ActionReducer, Action } from "@ngrx/store";
import { ScoreActions, NEW_SCORE, UPDATE_SCORES_STATE } from "./scores.actions";
import { Team } from "../enums/enums";

export interface ScoresState {
  team1: number;
  team2: number;
}

const initialState = {
  team1: 0,
  team2: 0
};

export function stateReducer(
  state = initialState,
  action: ScoreActions
): ScoresState {
  switch (action.type) {
    case NEW_SCORE:
      switch (action.payload.team) {
        case Team.TEAM1:
          return { team1: action.payload.score, team2: state.team2 };
        case Team.TEAM2:
          return { team1: state.team1, team2: action.payload.score };
      }
    default:
      return state;
  }
}

export function persistStateReducer(_reducer: ActionReducer<ScoresState>) {
  const localStorageKey = "__scores";
  return (state: ScoresState | undefined, action: Action) => {
    if (state === undefined) {
      const persisted = localStorage.getItem(localStorageKey);
      return persisted ? JSON.parse(persisted) : _reducer(state, action);
    }
    const nextState = _reducer(state, action);
    localStorage.setItem(localStorageKey, JSON.stringify(nextState));
    return nextState;
  };
}

export function updateStateReducer(_reducer: ActionReducer<ScoresState>) {
  return (state: ScoresState | undefined, action: Action) => {
    if (action.type === UPDATE_SCORES_STATE) {
      return (<any>action).payload.ScoreId;
    }

    return _reducer(state, action);
  };
}

export function reducer(state: ScoresState | undefined, action: Action) {
  return updateStateReducer(persistStateReducer(stateReducer))(state, action);
}
