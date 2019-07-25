import { ActionReducerMap } from "@ngrx/store";
import { environment } from "../../environments/environment";
import * as question from "./question.reducers";
import * as team from "./team.reducers";
import { storeFreeze } from "ngrx-store-freeze";

export interface FamiliadaState {
  question: question.QuestionState;
  team: team.TeamState;
}

export const reducers: ActionReducerMap<FamiliadaState> = {
  question: question.reducer,
  team: team.reducer
};

export const metaReducers = environment.production ? [] : [storeFreeze];
