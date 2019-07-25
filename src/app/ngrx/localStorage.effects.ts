import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { fromEvent, EMPTY } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import {
  UPDATE_QUESTIONS_STATE,
  QuestionActions,
  NEW_QUESTION,
  NEW_QUESTION_STORAGE
} from "./question.actions";
import {
  CHANGE_TEAM,
  CHANGE_TEAM_STORAGE,
  UPDATE_TEAMS_STATE
} from "./team.actions";

@Injectable()
export class LocalStorageEffects {
  @Effect({ dispatch: true })
  onChange = fromEvent<StorageEvent>(window, "storage").pipe(
    filter(evt => evt.key === "__bus"),
    filter(evt => evt.newValue !== null),
    map(evt => {
      const [{ type, payload }] = JSON.parse(evt.newValue);
      switch (type) {
        case NEW_QUESTION:
          return { type: NEW_QUESTION_STORAGE, payload };
        case CHANGE_TEAM:
          return { type: CHANGE_TEAM_STORAGE, payload };
        default:
          return EMPTY;
      }
    })
  );

  @Effect({ dispatch: false })
  storeActions = this.actions.pipe(
    ofType(NEW_QUESTION, CHANGE_TEAM),
    tap(action => {
      const storedActions = window.localStorage.getItem("__bus");
      const actions = storedActions ? JSON.parse(storedActions) : [];
      const newActions = [action, ...actions];
      window.localStorage.setItem("__bus", JSON.stringify(newActions));
    })
  );

  @Effect({ dispatch: true })
  updateQState = fromEvent<StorageEvent>(window, "storage").pipe(
    filter(evt => evt.key === "__questions"),
    filter(evt => evt.newValue !== null),
    map(evt => {
      const newState = JSON.parse(evt.newValue);
      return { type: UPDATE_QUESTIONS_STATE, payload: { newState } };
    })
  );

  @Effect({ dispatch: true })
  updateTState = fromEvent<StorageEvent>(window, "storage").pipe(
    filter(evt => evt.key === "__teams"),
    filter(evt => evt.newValue !== null),
    map(evt => {
      const newState = JSON.parse(evt.newValue);
      return { type: UPDATE_TEAMS_STATE, payload: { newState } };
    })
  );

  constructor(private actions: Actions<QuestionActions>) {}
}
