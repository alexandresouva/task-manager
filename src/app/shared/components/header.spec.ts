import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Header } from './header';
import { By } from '@angular/platform-browser';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    // Configure the testing module
    TestBed.configureTestingModule({
      imports: [Header],
    });

    // Compile the components (external templates and styles)
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const h1DebugEl = fixture.debugElement.query(By.css('h1'));
    const h1Content = h1DebugEl.nativeElement.textContent;

    expect(h1Content).toBe('Task Manager');
  });
});
