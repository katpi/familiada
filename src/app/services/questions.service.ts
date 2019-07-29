import { Injectable } from '@angular/core';
import { FamiliadaQuestion } from '../models/interfaces';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private questions: Observable<FamiliadaQuestion[]>;

  constructor(private db: DatabaseService) {
    this.questions = this.db.questions$
    .pipe(
      map((questions: FamiliadaQuestion[]) => {
        return questions.sort((a: FamiliadaQuestion, b: FamiliadaQuestion) => {
          return a.order > b.order ? 1 : b.order > a.order ? -1 : 0;
        });
      })
    );
  }

  getQuestion(questionId: number): Promise<FamiliadaQuestion> {
    return this.questions
      .pipe(
        map((questions: FamiliadaQuestion[]) => {
          return questionId >= 0 && questions.length > questionId
            ? questions[questionId]
            : null;
        }),
        take(1)
      )
      .toPromise();
  }

  getQuestionOrderNumbers(): Promise<number[]> {
    return this.questions
      .pipe(
        map((questions: FamiliadaQuestion[]) => {
          return questions.map((question: FamiliadaQuestion) => question.order).sort();
        }),
        take(1)
      )
      .toPromise();
  }

  saveQuestion(question: FamiliadaQuestion) {
    if (question.id === ' ') {
      this.db.addQuestion(question);
    } else {
      this.db.saveQuestion(question);
    }
  }

  deleteQuestion(question: FamiliadaQuestion) {
    this.db.deleteQuestion(question);
  }
}
