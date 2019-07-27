import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Team, GameState } from "../enums/enums";
import { QuestionsService } from "./questions.service";
import {
  FamiliadaQuestion,
  QuestionState,
  TeamState,
  AnswersState,
  ScoresState,
  FamiliadaResponse
} from "../models/interfaces";
import { AngularFirestore } from "@angular/fire/firestore";
import { isNullOrUndefined } from "util";

@Injectable({
  providedIn: "root"
})
export class FamiliadaService {
  questionId: number;
  team: string;
  answers: number[];
  team1Score: number;
  team2Score: number;

  constructor(
    private questionsService: QuestionsService,
    private db: AngularFirestore
  ) {
    this.db
      .doc("familiada/question")
      .valueChanges()
      .subscribe((questionState: QuestionState) => {
        if (isNullOrUndefined(questionState)) return;
        this.questionId = questionState.questionId;
        this.questionsService.getQuestion(this.questionId).then(question => {
          this.displayQuestion(question);
        });
      });
    this.db
      .doc("familiada/team")
      .valueChanges()
      .subscribe((teamState: TeamState) => {
        if (isNullOrUndefined(teamState)) return;
        this.team = teamState.team;
        this.updateTeam(this.team);
      });
    this.db
      .doc("familiada/answers")
      .valueChanges()
      .subscribe((answersState: AnswersState) => {
        if (isNullOrUndefined(answersState)) return;
        this.updateAnswers(answersState.answers);
      });
    this.db
      .doc("familiada/scores")
      .valueChanges()
      .subscribe((scoresState: ScoresState) => {
        if (isNullOrUndefined(scoresState)) return;
        this.updateScores(scoresState);
      });
  }

  private questionSource = new Subject<FamiliadaQuestion>();
  private answersSource = new Subject<number[]>();
  private currentTeamSource = new Subject<Team>();
  private team1ScoreSource = new Subject<number>();
  private team2ScoreSource = new Subject<number>();
  private gameStateSource = new Subject<GameState>();

  question$ = this.questionSource.asObservable();
  answers$ = this.answersSource.asObservable();
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

  private updateAnswers(answers: number[]) {
    this.answersSource.next(answers);
  }

  private updateScores(scoresState) {
    this.team1ScoreSource.next(scoresState.team1);
    this.team2ScoreSource.next(scoresState.team2);
  }

  initGame() {
    this.questionId = 0;
    this.answers = [];
    this.team1Score = 0;
    this.team2Score = 0;

    this.db.doc("familiada/scores").set({
      team1: this.team1Score,
      team2: this.team2Score
    });
    this.updateGameState(GameState.START);
    this.nextQuestion();
    this.setTeam(Team.TEAM1);
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

  claimAnswer(answer: FamiliadaResponse) {
    if (!this.answers.includes(answer.id)) {
      this.answers = [...this.answers, answer.id];
    }
    this.db.doc("familiada/answers").set({ answers: this.answers });
    if (this.team === Team.TEAM1) {
      this.team1Score += answer.points;
    } else {
      this.team2Score += answer.points;
    }
    this.db.doc("familiada/scores").set({
      team1: this.team1Score,
      team2: this.team2Score
    });
  }

  claimWrong(): any {
    console.log("claimed wrong answer");
    this.changeTeam();
  }

  setTeam(team: string) {
    this.team = team;
    this.db.doc("familiada/team").set({ team: this.team });
  }

  private nextQuestion() {
    this.answers = [];
    this.db.doc("familiada/answers").set({ answers: this.answers });
    this.db.doc("familiada/question").set({ questionId: ++this.questionId });
  }

  changeTeam() {
    const team = this.team === Team.TEAM1 ? Team.TEAM2 : Team.TEAM1;
    this.setTeam(team);
  }
}
