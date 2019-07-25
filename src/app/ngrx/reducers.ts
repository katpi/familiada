import { createReducer, on } from "@ngrx/store";
import { newQuestion } from "./actions";

export const questionReducer = createReducer(
  0,
  on(newQuestion, state => state + 1)
);

export const reducers = {
  questionId: questionReducer
};
