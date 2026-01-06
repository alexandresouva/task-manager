import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Layout } from '@core/layout/layout';

@Component({
  imports: [RouterModule, Layout],
  selector: 'app-root',
  template: ` <app-layout>
    <router-outlet />
  </app-layout>`,
})
export class App {}
