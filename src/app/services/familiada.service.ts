import { Injectable } from "@angular/core";
import { Subject, fromEvent } from "rxjs";
import { Team, GameState } from "../enums/enums";
import { QuestionsService } from "./questions.service";
import { Store } from "@ngrx/store";
import { newQuestion } from "../ngrx/question.actions";
import { QuestionState } from "../ngrx/question.reducers";
import { isNullOrUndefined } from "util";
import { changeTeam } from "../ngrx/team.actions";
import { TeamState } from "../ngrx/team.reducers";
import { FamiliadaQuestion } from "../models/interfaces";

@Injectable({
  providedIn: "root"
})
export class FamiliadaService {
  questionId: number;
  team: string;
  constructor(
    private store: Store<{ questionId: number }>,
    private questionsService: QuestionsService
  ) {
    this.store.select("question").subscribe((questionState: QuestionState) => {
      if (isNullOrUndefined(questionState)) return;
      this.questionId = questionState.questionId;
      this.questionsService.getQuestion(this.questionId).then(question => {
        this.displayQuestion(question);
      });
    });
    this.store.select("team").subscribe((teamState: TeamState) => {
      if (isNullOrUndefined(teamState)) return;
      this.team = teamState.team;
      this.updateTeam(this.team);
    });
  }

  private questionSource = new Subject<FamiliadaQuestion>();
  private currentTeamSource = new Subject<Team>();
  private team1ScoreSource = new Subject<number>();
  private team2ScoreSource = new Subject<number>();
  private gameStateSource = new Subject<GameState>();

  question$ = this.questionSource.asObservable();
  currentTeam$ = this.currentTeamSource.asObservable();
  team1Score$ = this.team1ScoreSource.asObservable();
  team2Score$ = this.team2ScoreSource.asObservable();
  gameState$ = this.gameStateSource.asObservable();

  private displayQuestion(question: FamiliadaQuestion) {
    this.questionSource.next(question);
  }

  private updateGameState(state: GameState) {
    this.gameStateSource.next(state);
  }

  private updateTeam(team: string) {
    this.currentTeamSource.next(Team[team]);
  }

  initGame() {
    this.questionId = -1;
    this.team = "TEAM1";
    this.updateGameState(GameState.START);
    this.nextQuestion();
    this.changeTeam();
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

  claimResponse() {
    this.changeTeam();
  }

  setTeam(team: Team) {
    this.team = team;
    this.store.dispatch(changeTeam({ team: this.team }));
  }

  private nextQuestion() {
    this.store.dispatch(newQuestion({ questionId: this.questionId }));
  }

  private changeTeam() {
    this.team = this.team === Team.TEAM1 ? Team.TEAM2 : Team.TEAM1;
    this.store.dispatch(changeTeam({ team: this.team }));
  }
}
