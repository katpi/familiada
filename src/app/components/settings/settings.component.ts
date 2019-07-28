import { Component } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { FamiliadaQuestion } from 'src/app/models/interfaces';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { EditQuestionDialog } from './edit-question-dialog/edit-question-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent  {
  dataSource: FamiliadaQuestion[];
  displayedColumns: string[] = ['id', 'question', 'answers', 'actions'];
  teamNamesForm = this.fb.group({
    team1: [''],
    team2: [''],
  });

  constructor(
    private fb: FormBuilder,
    private db: DatabaseService,
    private dialog: MatDialog
    ) {
    this.db.questions$.subscribe(questionsState => this.dataSource = questionsState.questions);
  }

  saveTeamNames() {
    console.log(this.teamNamesForm.value);
  }

  addQuestion() {}

  editQuestion(question: FamiliadaQuestion) {
    this.dialog.open(EditQuestionDialog, {data: question});
  }

  deleteQuestion(question: FamiliadaQuestion) {}
}
