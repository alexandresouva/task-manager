import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { By } from '@angular/platform-browser';

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

  it('should have app-header in the template', async () => {
    const { fixture } = await setup();
    const appHeaderEl = fixture.debugElement.query(By.css('app-header'));

    expect(appHeaderEl).toBeTruthy();
  });

  it('should have router-outlet in the template', async () => {
    const { fixture } = await setup();
    const routerOutletEl = fixture.debugElement.query(By.css('router-outlet'));

    expect(routerOutletEl).toBeTruthy();
  });
});
