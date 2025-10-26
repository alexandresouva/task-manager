import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Header } from '@shared/components/header/header';

@Component({
  imports: [RouterModule, Header],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected title = 'task-manager';
}
