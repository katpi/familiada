import { Component } from '@angular/core';

import { FamiliadaService } from './services/familiada.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'familiada';

  constructor(private familiadaService: FamiliadaService) {}

  init() {
    this.familiadaService.init();
  }
}
