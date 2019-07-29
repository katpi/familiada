import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FamiliadaQuestion, FamiliadaResponse } from 'src/app/models/interfaces';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QuestionsService } from 'src/app/services/questions.service';
import { ResponsesDataSource } from './ResponsesDataSource';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-edit-question-dialog',
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class EditQuestionDialog {
  answers: FamiliadaResponse[];
  dataSource = new ResponsesDataSource();
  displayedColumns: string[] = ['response', 'points', 'actions'];
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditQuestionDialog>,
    private questionsService: QuestionsService,
    @Inject(MAT_DIALOG_DATA) public data: FamiliadaQuestion,
  ) {
    if (isNullOrUndefined(this.data)) {
      this.data = { id: ' ', order: 6666, question: null, answers: []};
    }
    this.init();
  }

  init() {
    this.answers = this.data.answers;
    this.dataSource.responsesSubject.next(this.answers);
    this.questionForm = this.fb.group({
      question: [this.data.question],
      answer: [''],
      points: [''],
    });
  }

  addResponse() {
    if (this.questionForm.value.answer.length < 1 || this.questionForm.value.points.length < 1) {
      return;
    }
    const response: FamiliadaResponse = {
        id: null,
        points: this.questionForm.value.points,
        response: this.questionForm.value.answer,
      };
    this.answers = [...this.answers, response];
    this.dataSource.responsesSubject.next(this.answers);
    this.questionForm.patchValue({
      answer: [''],
      points: [''],
    });
  }

  deleteResponse(response: FamiliadaResponse) {
    const index = this.answers.indexOf(response);
    if (index > -1) {
      this.answers.splice(index, 1);
    }
    this.dataSource.responsesSubject.next(this.answers);
  }

  async saveQuestion() {
    this.addResponse();
    const answers = this.answers.sort((a: FamiliadaResponse, b: FamiliadaResponse) => {
      return (a.points > b.points) ? -1 : ((b.points > a.points) ? 1 : 0);
    });
    for (let i = 0; i < this.answers.length; i++) {
      this.answers[i].id = i;
    }
    const question: FamiliadaQuestion = {
      id: this.data.id,
      order: this.data.order,
      question: this.questionForm.value.question,
      answers
    };
    console.log(question)
    await this.questionsService.saveQuestion(question);
    this.dialogRef.close();
  }
}



