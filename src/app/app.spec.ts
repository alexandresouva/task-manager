import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { By } from '@angular/platform-browser';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have app-header in the template', () => {
    const appHeaderEl = fixture.debugElement.query(By.css('app-header'));
    expect(appHeaderEl).toBeTruthy();
  });

  it('should have router-outlet in the template', () => {
    const routerOutletEl = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutletEl).toBeTruthy();
  });
});
