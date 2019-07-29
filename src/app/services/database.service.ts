import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {
  RoundState,
  Scores,
  GameState,
  FamiliadaSettings,
  FamiliadaQuestion
} from '../models/interfaces';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private roundSource = new ReplaySubject<RoundState>();
  private scoresSource = new ReplaySubject<Scores>();
  private gameStateSource = new ReplaySubject<GameState>();
  private settingsSource = new ReplaySubject<FamiliadaSettings>();
  private questionsSource = new ReplaySubject<FamiliadaQuestion[]>();

  roundState$ = this.roundSource.asObservable();
  scores$ = this.scoresSource.asObservable();
  gameState$ = this.gameStateSource.asObservable();
  settings$ = this.settingsSource.asObservable();
  questions$ = this.questionsSource.asObservable();

  constructor(private db: AngularFirestore) {
    this.db
      .doc('familiada/round')
      .valueChanges()
      .subscribe((roundState: RoundState) => {
        if (isNullOrUndefined(roundState)) {
          return;
        }
        this.roundSource.next(roundState);
      });
    this.db
      .doc('familiada/scores')
      .valueChanges()
      .subscribe((scoresState: Scores) => {
        if (isNullOrUndefined(scoresState)) {
          return;
        }
        this.scoresSource.next(scoresState);
      });
    this.db
      .doc('familiada/state')
      .valueChanges()
      .subscribe((gameState: GameState) => {
        if (isNullOrUndefined(gameState)) {
          return;
        }
        this.gameStateSource.next(gameState);
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
      .valueChanges().subscribe((questions: FamiliadaQuestion[]) => {
        if (isNullOrUndefined(questions)) { return; }
        this.questionsSource.next(questions);
        this.updateSettings({questionsCount: questions.length});
      });
  }

  updateGameState(state: GameState) {
    this.db.doc('familiada/state').set(state);
  }
  updateScores(scores: Scores) {
    this.db.doc('familiada/scores').set(scores);
  }
  updateRoundState(roundState: RoundState) {
    this.db.doc('familiada/round').set(roundState);
  }
  updateSettings(settings: Partial<FamiliadaSettings>) {
    this.db.doc('settings/settings').update(settings);
  }

  // tslint:disable-next-line:member-ordering
  private questionsCollection = this.db.collection<FamiliadaQuestion>('questions');
  async addQuestion(question: FamiliadaQuestion) {
    const docRef: DocumentReference = await this.questionsCollection.add(question);
    question.id = docRef.id;
    await this.saveQuestion(question);
  }
  async saveQuestion(question: FamiliadaQuestion) {
    this.questionsCollection.doc(question.id).set(question);
  }
  async deleteQuestion(question: FamiliadaQuestion) {
    this.questionsCollection.doc(question.id).delete();
  }
  async updateQuestionsOrder(questions: FamiliadaQuestion[]) {
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
    return questions;
  }
}
