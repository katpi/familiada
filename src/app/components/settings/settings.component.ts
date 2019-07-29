import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { FamiliadaQuestion } from 'src/app/models/interfaces';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { EditQuestionDialog } from './edit-question-dialog/edit-question-dialog.component';
import { QuestionsService } from '../../services/questions.service';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
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
    private dialog: MatDialog
  ) {
    this.questionService.getQuestions().subscribe(questions => {
      console.log(questions)
      this.dataSource = questions;
    });
  }

  saveTeamNames() {
    this.db.updateSettings(this.teamNamesForm.value);
  }

  addQuestion() {
    this.dialog.open(EditQuestionDialog);
  }

  editQuestion(question: FamiliadaQuestion) {
    this.dialog.open(EditQuestionDialog, {data: question});
  }

  async deleteQuestion(question: FamiliadaQuestion) {
    await this.questionService.deleteQuestion(question);
  }
}
