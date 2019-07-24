import { Injectable } from "@angular/core";
import { FamiliadaResponse, FamiliadaQuestion } from "../models/interfaces";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class QuestionsService {
  private questions: Observable<FamiliadaQuestion[]>;
  private currentQuestion = 0;

  constructor(private http: HttpClient) {
    this.questions = this.http.get<FamiliadaQuestion[]>(
      "./assets/questions.json"
    );
  }

  getQuestion(): Promise<string> {
    return new Promise(resolve => {
      this.questions.subscribe(questions => {
        console.log(questions);
        resolve(questions[this.currentQuestion].question);
      });
    });
  }

  getAnswers(): Promise<FamiliadaResponse[]> {
    return new Promise(resolve => {
      this.questions.subscribe(questions => {
        console.log(questions);
        resolve(questions[this.currentQuestion].answers);
      });
    });
  }
  
  next(): any {
    this.currentQuestion++;
  }

  getResponses(): Promise<FamiliadaResponse[]> {
    return of([{ id: 100, response: "owszem", points: 100 }]).toPromise();
  }
}
