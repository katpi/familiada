import { Injectable } from '@angular/core';
import { FamiliadaQuestion } from '../models/interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionsFromFileService {
  private questions: Observable<FamiliadaQuestion[]>;

  constructor(private http: HttpClient) {
    this.questions = this.http.get<FamiliadaQuestion[]>(
      "./assets/questions.json"
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
}
