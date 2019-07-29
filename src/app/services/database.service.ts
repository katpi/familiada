import { Injectable } from "@angular/core";
import { ReplaySubject, Subject } from "rxjs";
import {
  RoundState,
  Scores,
  GameState,
  FamiliadaSettings,
  FamiliadaQuestion,
  EventState
} from "../models/interfaces";
import { AngularFirestore } from "@angular/fire/firestore";
import { isNullOrUndefined } from "util";
import { FamiliadaEvent } from "../enums/enums";

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  private questions: FamiliadaQuestion[] = [];

  private roundSource = new ReplaySubject<RoundState>();
  private scoresSource = new ReplaySubject<Scores>();
  private gameStateSource = new ReplaySubject<GameState>();
  private settingsSource = new ReplaySubject<FamiliadaSettings>();
  private questionsSource = new ReplaySubject<FamiliadaQuestion[]>();
  private eventSource = new Subject<FamiliadaEvent>();

  roundState$ = this.roundSource.asObservable();
  scores$ = this.scoresSource.asObservable();
  gameState$ = this.gameStateSource.asObservable();
  settings$ = this.settingsSource.asObservable();
  questions$ = this.questionsSource.asObservable();
  event$ = this.eventSource.asObservable();

  constructor(private db: AngularFirestore) {
    this.db
      .doc("familiada/round")
      .valueChanges()
      .subscribe((roundState: RoundState) => {
        if (isNullOrUndefined(roundState)) {
          return;
        }
        this.roundSource.next(roundState);
      });
    this.db
      .doc("familiada/scores")
      .valueChanges()
      .subscribe((scoresState: Scores) => {
        if (isNullOrUndefined(scoresState)) {
          return;
        }
        this.scoresSource.next(scoresState);
      });
    this.db
      .doc("familiada/state")
      .valueChanges()
      .subscribe((gameState: GameState) => {
        if (isNullOrUndefined(gameState)) {
          return;
        }
        this.gameStateSource.next(gameState);
      });
    this.db
      .doc("familiada/events")
      .valueChanges()
      .subscribe((event: EventState) => {
        if (isNullOrUndefined(event)) {
          return;
        }
        this.eventSource.next(event.event);
      });
    this.db
      .doc("settings/settings")
      .valueChanges()
      .subscribe((settings: FamiliadaSettings) => {
        if (isNullOrUndefined(settings)) {
          return;
        }
        this.settingsSource.next(settings);
      });
    this.db
      .collection<FamiliadaQuestion>("questions")
      .valueChanges()
      .subscribe((questions: FamiliadaQuestion[]) => {
        if (isNullOrUndefined(questions)) {
          return;
        }
        this.questions = questions;
        this.questionsSource.next(this.questions);
        this.updateSettings({ questionsCount: this.questions.length });
      });
  }

  updateGameState(state: GameState) {
    this.db.doc("familiada/state").set(state);
  }
  updateScores(scores: Scores) {
    this.db.doc("familiada/scores").set(scores);
  }
  updateRoundState(roundState: RoundState) {
    this.db.doc("familiada/round").set(roundState);
  }
  updateSettings(settings: Partial<FamiliadaSettings>) {
    this.db.doc("settings/settings").update(settings);
  }

  // tslint:disable-next-line:member-ordering
  private questionsCollection = this.db.collection<FamiliadaQuestion>(
    "questions"
  );
  async addQuestion(question: FamiliadaQuestion) {
    question.id = this.db.createId();
    await this.saveQuestion(question);
  }
  async saveQuestion(question: FamiliadaQuestion) {
    this.questions.push(question);
    this.questionsCollection.doc(question.id).set(question);
    await this.updateQuestionsOrder();
  }
  async deleteQuestion(question: FamiliadaQuestion) {
    this.questions.splice(this.questions.indexOf(question), 1);
    await this.questionsCollection.doc(question.id).delete();
    await this.updateQuestionsOrder();
  }
  private async updateQuestionsOrder() {
    const questions = this.questions;
    if (isNullOrUndefined(questions) || questions.length < 1) {
      return;
    }
    questions.sort((a: FamiliadaQuestion, b: FamiliadaQuestion) => {
      return a.order > b.order ? 1 : b.order > a.order ? -1 : 0;
    });
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (i !== question.order) {
        question.order = i;
        await this.questionsCollection.doc(question.id).set(question);
      }
    }
  }

  requestPlayIntro() {
    this.db.doc("familiada/events").set({ event: FamiliadaEvent.PLAY_INTRO });
  }
  clearEvent() {
    this.db.doc("familiada/events").delete();
  }
}
