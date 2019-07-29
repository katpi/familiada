import { Injectable } from '@angular/core';
import { FamiliadaQuestion } from '../models/interfaces';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import { isNullOrUndefined } from 'util';

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

  getQuestions(): Observable<FamiliadaQuestion[]> {
    return this.questions;
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

  saveQuestion(question: FamiliadaQuestion) {
    if (isNullOrUndefined(question.id)) {
      this.db.addQuestion(question);
    } else {
      this.db.saveQuestion(question);
    }
  }

  async deleteQuestion(question: FamiliadaQuestion) {
    await this.db.deleteQuestion(question);
  }
}
