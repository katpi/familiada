import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControllerComponent } from './components/controller/controller.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GameEndedComponent } from './components/game-ended/game-ended.component';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { EditQuestionDialog } from './components/settings/edit-question-dialog/edit-question-dialog.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StartGameComponent } from './components/start-game/start-game.component';
import { AppMaterialModules } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    DashboardComponent,
    ScoreboardComponent,
    ControllerComponent,
    StartGameComponent,
    GameEndedComponent,
    EditQuestionDialog,
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
    EditQuestionDialog,
  ],
})
export class AppModule {}
