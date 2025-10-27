import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Header } from '@shared/components/header/header';
import { ToastList } from '@shared/components/toast-list/toast-list';

@Component({
  imports: [RouterModule, Header, ToastList],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected title = 'task-manager';
}
