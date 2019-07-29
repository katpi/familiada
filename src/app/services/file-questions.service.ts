import { Injectable } from '@angular/core';
import { FamiliadaQuestion } from '../models/interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  getQuestions(): Observable<FamiliadaQuestion[]> {
    return this.questions;
  }
}
