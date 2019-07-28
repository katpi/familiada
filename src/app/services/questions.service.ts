import { Injectable } from "@angular/core";
import { FamiliadaQuestion } from "../models/interfaces";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { DatabaseService } from "./database.service";

@Injectable({
  providedIn: "root"
})
export class QuestionsService {
  private questions: Observable<FamiliadaQuestion[]>;

  constructor(private db: DatabaseService) {
    this.questions = this.db.questions$;
    // .pipe(
    //   map((questions: FamiliadaQuestion[]) => {
    //     return questions.sort((a: FamiliadaQuestion, b: FamiliadaQuestion) => {
    //       return a.id > b.id ? -1 : b.id > a.id ? 1 : 0;
    //     });
    //   }),
    //   map((questions: FamiliadaQuestion[]) => {
    //     for (let i = 0; i < questions.length; i++) {
    //       questions[i].id = i;
    //     }
    //     return questions;
    //   })
    // );
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
    this.db.addQuestion(question);
  }
}
