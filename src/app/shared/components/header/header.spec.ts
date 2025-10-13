import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Header } from './header';

async function setup() {
  // Configure the testing module
  TestBed.configureTestingModule({
    imports: [Header],
  });
  // Compile the components (external templates and styles)
  await TestBed.compileComponents();

  const fixture = TestBed.createComponent(Header);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { component, fixture };
}

describe('Header', () => {
  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    const { fixture } = await setup();
    const h1DebugEl = fixture.debugElement.query(By.css('h1'));
    const h1Content = h1DebugEl.nativeElement.textContent;

    expect(h1Content).toBe('Task Manager');
  });
});
