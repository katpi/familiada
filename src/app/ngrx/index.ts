import { ActionReducerMap } from "@ngrx/store";
import { environment } from "../../environments/environment";
import * as question from "./question.reducers";
import * as team from "./team.reducers";
import * as answers from "./answer.reducers";
import { storeFreeze } from "ngrx-store-freeze";

export interface FamiliadaState {
  question: question.QuestionState;
  team: team.TeamState;
  answers: answers.AnswersState;
}

export const reducers: ActionReducerMap<FamiliadaState> = {
  question: question.reducer,
  team: team.reducer,
  answers: answers.reducer
};

export const metaReducers = environment.production ? [] : [storeFreeze];
