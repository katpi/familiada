import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SettingsComponent } from './components/settings/settings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { ControllerComponent } from './components/controller/controller.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { ChooseTeamDialog } from './components/controller/choose-team-dialog/choose-team-dialog.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { RoundEndedDialog } from './components/controller/round-ended-dialog/round-ended-dialog.component';
import { GameEndedComponent } from './components/game-ended/game-ended.component';
import { AppMaterialModules } from './material.module';
import { EditQuestionDialog } from './components/settings/edit-question-dialog/edit-question-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    DashboardComponent,
    ScoreboardComponent,
    ControllerComponent,
    ChooseTeamDialog,
    StartGameComponent,
    RoundEndedDialog,
    GameEndedComponent,
    EditQuestionDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AppMaterialModules,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    ChooseTeamDialog,
    RoundEndedDialog,
    EditQuestionDialog
  ]
})
export class AppModule {}
