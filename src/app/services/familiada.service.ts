import { Injectable } from "@angular/core";
import { Subject, fromEvent } from "rxjs";
import { Team, GameState } from "../enums/enums";
import { QuestionsService } from "./questions.service";
import { Store } from "@ngrx/store";
import { newQuestion } from "../ngrx/question.actions";
import { QuestionState } from "../ngrx/question.reducers";
import { isNullOrUndefined } from "util";

@Injectable({
  providedIn: "root"
})
export class FamiliadaService {
  questionId: number;
  constructor(
    private store: Store<{ questionId: number }>,
    private questionsService: QuestionsService
  ) {
    this.questionId = 0;
    this.store.select("question").subscribe((question: QuestionState) => {
      if (isNullOrUndefined(question)) return;
      this.questionId = question.questionId;
      this.questionsService.getQuestion(this.questionId).then(question => {
        this.displayQuestion(question);
      });
    });
  }

  private questionSource = new Subject<string>();
  private team1ScoreSource = new Subject<number>();
  private team2ScoreSource = new Subject<number>();
  private gameStateSource = new Subject<GameState>();

  question$ = this.questionSource.asObservable();
  team1Score$ = this.team1ScoreSource.asObservable();
  team2Score$ = this.team1ScoreSource.asObservable();
  gameState$ = this.gameStateSource.asObservable();

  private displayQuestion(question: string) {
    this.questionSource.next(question);
  }

  private updateGameState(state: GameState) {
    this.gameStateSource.next(state);
  }

  initGame() {
    this.updateGameState(GameState.START);
    this.nextQuestion();
  }

  endRound() {
    this.updateGameState(GameState.ROUND_ENDED);
    this.nextQuestion();
  }

  endGame() {
    this.updateGameState(GameState.END);
  }

  joke() {
    this.updateGameState(GameState.JOKE);
  }

  private nextQuestion() {
    this.store.dispatch(newQuestion({ questionId: this.questionId }));
  }

  claimResponse() {}
}
