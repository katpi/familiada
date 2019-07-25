import { ActionReducer, Action } from "@ngrx/store";

import { TeamActions, CHANGE_TEAM, UPDATE_TEAMS_STATE } from './team.actions';
import { Team } from '../enums/enums';

export interface TeamState {
  team: string
}

const initialState = { team: Team.TEAM1 };

export function stateReducer(
  state = initialState,
  action: TeamActions
): TeamState {
  switch (action.type) {
    case CHANGE_TEAM:
      return action.payload;
    default:
      return state;
  }
}

export function persistStateReducer(_reducer: ActionReducer<TeamState>) {
  const localStorageKey = "__teams";
  return (state: TeamState | undefined, action: Action) => {
    if (state === undefined) {
      const persisted = localStorage.getItem(localStorageKey);
      return persisted ? JSON.parse(persisted) : _reducer(state, action);
    }
    const nextState = _reducer(state, action);
    localStorage.setItem(localStorageKey, JSON.stringify(nextState));
    return nextState;
  };
}

export function updateStateReducer(_reducer: ActionReducer<TeamState>) {
  return (state: TeamState | undefined, action: Action) => {
    if (action.type === UPDATE_TEAMS_STATE) {
      return (<any>action).payload.team;
    }

    return _reducer(state, action);
  };
}

export function reducer(state: TeamState | undefined, action: Action) {
  return updateStateReducer(persistStateReducer(stateReducer))(state, action);
}
