import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-bars',
  imports: [],
  templateUrl: './loading-bars.html',
})
export class LoadingBars {
  readonly loading = input<boolean>(false);
  readonly showMessage = input<boolean>(false);
  readonly message = input<string>(`Loading...`);
}
