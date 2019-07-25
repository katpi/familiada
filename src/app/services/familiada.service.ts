import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Team, GameState } from "../enums/enums";
import { QuestionsService } from "./questions.service";
import { Store, select } from "@ngrx/store";
import { newQuestion } from "../ngrx/actions";

@Injectable({
  providedIn: "root"
})
export class FamiliadaService {
  constructor(
    private store: Store<{ questionId: number }>,
    private questionsService: QuestionsService
  ) {
    this.store.pipe(select("questionId")).subscribe((questionId) => {
      this.questionsService
        .getQuestion(questionId)
        .then(question => this.displayQuestion(question));
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

  private updateScore(team: Team, score: number) {
    switch (team) {
      case Team.TEAM1:
        this.team1ScoreSource.next(score);
        break;
      case Team.TEAM2:
        this.team2ScoreSource.next(score);
        break;
    }
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
    this.store.dispatch(newQuestion());
  }

  claimResponse() {}
}
