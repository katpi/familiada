import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FamiliadaQuestion } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class QuestionsFromFileService {
  private questions: Observable<FamiliadaQuestion[]>;

  constructor(private http: HttpClient) {
    this.questions = this.http.get<FamiliadaQuestion[]>(
      './assets/questions.json',
    );
  }

  getQuestions(): Observable<FamiliadaQuestion[]> {
    return this.questions;
  }
}
