import { Injectable } from "@angular/core";
import { FamiliadaResponse, FamiliadaQuestion } from "../models/interfaces";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class QuestionsService {
  private questions: Observable<FamiliadaQuestion[]>;

  constructor(private http: HttpClient) {
    this.questions = this.http.get<FamiliadaQuestion[]>(
      "./assets/questions.json"
    );
  }

  getQuestion(questionId: number): Promise<string> {
    return this.questions
      .pipe(
        map((questions: FamiliadaQuestion[]) =>
          questions.length > questionId ? questions[questionId].question : null
        )
      )
      .toPromise();
  }

  getAnswers(questionId: number): Promise<FamiliadaResponse[]> {
    return new Promise(resolve => {
      this.questions.subscribe(questions => {
        resolve(questions[questionId].answers);
      });
    });
  }

  getResponses(): Promise<FamiliadaResponse[]> {
    return of([{ id: 100, response: "owszem", points: 100 }]).toPromise();
  }
}
