import { ActionReducerMap } from "@ngrx/store";
import { environment } from "../../environments/environment";
import * as question from "./question.reducers";
import { storeFreeze } from "ngrx-store-freeze";

export interface FamiliadaState {
  question: question.QuestionState;
}

export const reducers: ActionReducerMap<FamiliadaState> = {
  question: question.reducer
};

export const metaReducers = environment.production ? [] : [storeFreeze];
