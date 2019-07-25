import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { fromEvent, EMPTY } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
import { UPDATE_QUESTIONS_STATE, QuestionActions, NEW_QUESTION, NEW_QUESTION_STORAGE } from './question.actions';

@Injectable()
export class LocalStorageEffects {
  @Effect({ dispatch: true })
  onChange = fromEvent<StorageEvent>(window, 'storage').pipe(
    filter(evt => evt.key === '__bus'),
    filter(evt => evt.newValue !== null),
    map(evt => {
      const [{ type, payload }] = JSON.parse(evt.newValue);
      switch (type) {
        case NEW_QUESTION:
          return { type: NEW_QUESTION_STORAGE, payload };
        default:
          return EMPTY;
      }
    }),
  );

  @Effect({ dispatch: false })
  storeActions = this.actions.pipe(
    ofType(
      NEW_QUESTION
    ),
    tap(action => {
      const storedActions = window.localStorage.getItem('__bus');
      const actions = storedActions ? JSON.parse(storedActions) : [];
      const newActions = [action, ...actions];
      window.localStorage.setItem('__bus', JSON.stringify(newActions));
    }),
  );

  // change this to `dispatch: true` to sync state with state
  @Effect({ dispatch: true })
  updateState = fromEvent<StorageEvent>(window, 'storage').pipe(
    filter(evt => evt.key === '__questions'),
    filter(evt => evt.newValue !== null),
    map(evt => {
      const newState = JSON.parse(evt.newValue);
      return { type: UPDATE_QUESTIONS_STATE, payload: { newState } };
    }),
  );
  
  constructor(private actions: Actions<QuestionActions>) {}
}
