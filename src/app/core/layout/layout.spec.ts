import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Layout } from './layout';

async function setup() {
  TestBed.configureTestingModule({
    imports: [Layout],
  });
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(Layout);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { component, fixture };
}

describe('Layout', () => {
  it('should create the component', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should have app-header in the template', async () => {
    const { fixture } = await setup();
    const appHeaderEl = fixture.debugElement.query(By.css('app-header'));

    expect(appHeaderEl).toBeTruthy();
  });

  it('should have app-toast-list in the template', async () => {
    const { fixture } = await setup();
    const appToastListEl = fixture.debugElement.query(By.css('app-toast-list'));

    expect(appToastListEl).toBeTruthy();
  });

  it('should have app-loading-bars in the template', async () => {
    const { fixture } = await setup();
    const appLoadingBarsEl = fixture.debugElement.query(
      By.css('app-loading-bars'),
    );
    expect(appLoadingBarsEl).toBeTruthy();
  });
});
