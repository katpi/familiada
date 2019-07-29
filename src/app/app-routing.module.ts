import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ControllerComponent } from './components/controller/controller.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'controller', component: ControllerComponent },
  { path: 'setup', component: SettingsComponent },
  { path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
