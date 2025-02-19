import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ReplaySubject, Subject } from 'rxjs';
import { isNullOrUndefined } from 'util';

import { FamiliadaEvent } from '../enums/enums';
import {
  FamiliadaEventState,
  FamiliadaGameState,
  FamiliadaQuestion,
  FamiliadaRoundState,
  FamiliadaScores,
  FamiliadaSettings,
} from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private questions: FamiliadaQuestion[] = [];

  private roundSource = new ReplaySubject<FamiliadaRoundState>();
  private scoresSource = new ReplaySubject<FamiliadaScores>();
  private gameStateSource = new ReplaySubject<FamiliadaGameState>();
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
      .doc('familiada/round')
      .valueChanges()
      .subscribe((roundState: FamiliadaRoundState) => {
        if (isNullOrUndefined(roundState)) {
          return;
        }
        this.roundSource.next(roundState);
      });
    this.db
      .doc('familiada/scores')
      .valueChanges()
      .subscribe((scoresState: FamiliadaScores) => {
        if (isNullOrUndefined(scoresState)) {
          return;
        }
        this.scoresSource.next(scoresState);
      });
    this.db
      .doc('familiada/state')
      .valueChanges()
      .subscribe((gameState: FamiliadaGameState) => {
        if (isNullOrUndefined(gameState)) {
          return;
        }
        this.gameStateSource.next(gameState);
      });
    this.db
      .doc('familiada/events')
      .valueChanges()
      .subscribe((event: FamiliadaEventState) => {
        if (isNullOrUndefined(event)) {
          return;
        }
        this.eventSource.next(event.event);
      });
    this.db
      .doc('settings/settings')
      .valueChanges()
      .subscribe((settings: FamiliadaSettings) => {
        if (isNullOrUndefined(settings)) {
          return;
        }
        this.settingsSource.next(settings);
      });
    this.db
      .collection<FamiliadaQuestion>('questions')
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

  updateGameState(state: FamiliadaGameState) {
    this.db.doc('familiada/state').set(state);
  }
  updateScores(scores: FamiliadaScores) {
    this.db.doc('familiada/scores').set(scores);
  }
  updateRoundState(roundState: FamiliadaRoundState) {
    this.db.doc('familiada/round').set(roundState);
  }
  updateSettings(settings: Partial<FamiliadaSettings>) {
    this.db.doc('settings/settings').update(settings);
  }

  // tslint:disable-next-line:member-ordering
  private questionsCollection = this.db.collection<FamiliadaQuestion>(
    'questions',
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
  async swapQuestions(question1: FamiliadaQuestion, question2: FamiliadaQuestion) {
    const tmp: number = question1.order;
    question1.order = question2.order;
    question2.order = tmp;
    await this.questionsCollection.doc(question1.id).set(question1);
    await this.questionsCollection.doc(question2.id).set(question2);
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
    for (let i = 0; i < questions.length; i = i + 1) {
      const question = questions[i];
      if (i !== question.order) {
        question.order = i;
        await this.questionsCollection.doc(question.id).set(question);
      }
    }
  }

  requestPlayIntro() {
    this.db.doc('familiada/events').set({ event: FamiliadaEvent.PLAY_INTRO });
  }
  requestPlayGoodAnswer() {
    this.db.doc('familiada/events').set({ event: FamiliadaEvent.GOOD_ANSWER });
  }
  requestPlayWrongAnswer() {
    this.db.doc('familiada/events').set({ event: FamiliadaEvent.WRONG_ANSWER });
  }
  requestPlayNewRound() {
    this.db.doc('familiada/events').set({ event: FamiliadaEvent.NEW_ROUND });
  }
  requestJoke() {
    this.db.doc('familiada/events').set({ event: FamiliadaEvent.JOKE });
  }
  finishJoke() {
    this.db.doc('familiada/events').set({ event: FamiliadaEvent.END_JOKE });
  }
  requestApplause() {
    this.db.doc('familiada/events').set({ event: FamiliadaEvent.APPLAUSE });
  }
  clearEvent() {
    this.db.doc('familiada/events').delete();
  }
}
