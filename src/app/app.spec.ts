import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { App } from './app';

async function setup() {
  TestBed.configureTestingModule({
    imports: [App],
  });
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(App);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { component, fixture };
}

describe('App', () => {
  it('should create the component', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should have app-layout in the template', async () => {
    const { fixture } = await setup();
    const appLayoutEl = fixture.debugElement.query(By.css('app-layout'));

    expect(appLayoutEl).toBeTruthy();
  });

  it('should have router-outlet in the template', async () => {
    const { fixture } = await setup();
    const routerOutletEl = fixture.debugElement.query(By.css('router-outlet'));

    expect(routerOutletEl).toBeTruthy();
  });
});
