import { Injectable } from '@angular/core';
import { FamiliadaResponse, FamiliadaQuestion } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private questions: Observable<FamiliadaQuestion[]>;

  constructor(private http: HttpClient) {
    this.questions = this.http.get<FamiliadaQuestion[]>(
      './assets/questions.json'
    );
  }

  getQuestions(): Promise<FamiliadaQuestion[]> {
    return this.http.get<FamiliadaQuestion[]>(
      './assets/questions.json'
    ).toPromise();
  }

  getQuestion(questionId: number): Promise<FamiliadaQuestion> {
    return this.questions
      .pipe(
        map((questions: FamiliadaQuestion[]) => {
          return questionId >= 0 && questions.length > questionId
            ? questions[questionId]
            : null;
        })
      )
      .toPromise();
  }

  getAnswersCount(questionId: number): Promise<number> {
    return this.questions
      .pipe(
        map((questions: FamiliadaQuestion[]) => {
          return questionId >= 0 && questions.length > questionId
            ? questions[questionId].answers.length
            : 0;
        })
      )
      .toPromise();
  }

  saveQuestion(question: FamiliadaQuestion) {
    console.log(question);
  }
}
