import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { FamiliadaQuestion } from 'src/app/models/interfaces';
import { DatabaseService } from 'src/app/services/database.service';

import { QuestionsService } from '../../services/questions.service';

import { EditQuestionDialog } from './edit-question-dialog/edit-question-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent  {
  dataSource: FamiliadaQuestion[];
  displayedColumns: string[] = ['id', 'question', 'answers', 'actions'];
  teamNamesForm = this.fb.group({
    team1Name: [''],
    team2Name: [''],
  });

  constructor(
    private fb: FormBuilder,
    private db: DatabaseService,
    private questionService: QuestionsService,
    private dialog: MatDialog,
  ) {
    this.questionService.getQuestions().subscribe((questions) => {
      this.dataSource = questions;
    });
  }

  saveTeamNames() {
    this.db.updateSettings(this.teamNamesForm.value);
  }

  addQuestion() {
    this.dialog.open(EditQuestionDialog);
  }

  async up(question: FamiliadaQuestion) {
    await this.questionService.swapQuestions(question, this.dataSource[question.order - 1]);
  }

  async down(question: FamiliadaQuestion) {
    await this.questionService.swapQuestions(question, this.dataSource[question.order + 1]);
  }

  editQuestion(question: FamiliadaQuestion) {
    this.dialog.open(EditQuestionDialog, { data: question });
  }

  async deleteQuestion(question: FamiliadaQuestion) {
    await this.questionService.deleteQuestion(question);
  }
}
