import { TestBed } from '@angular/core/testing';

import { TestHelper } from '@testing/test-helper/test-helper';

import { LoadingBars } from './loading-bars';

function setup() {
  TestBed.configureTestingModule({
    imports: [LoadingBars],
  }).compileComponents();

  const fixture = TestBed.createComponent(LoadingBars);
  const component = fixture.componentInstance;
  const testHelper = new TestHelper(fixture);
  fixture.detectChanges();

  return { fixture, component, testHelper };
}

describe('LoadingBars', () => {
  it('should create', () => {
    const { component } = setup();
    expect(component).toBeTruthy();
  });

  describe('when loading starts', () => {
    let fixture: ReturnType<typeof setup>['fixture'];
    let testHelper: ReturnType<typeof setup>['testHelper'];

    beforeEach(() => {
      ({ fixture, testHelper } = setup());
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
    });

    it('should show loading bars', () => {
      const loadingBars = testHelper.queries.query('loading-bars');
      expect(loadingBars).toBeTruthy();
    });

    describe('and showMessage is true', () => {
      beforeEach(() => {
        fixture.componentRef.setInput('showMessage', true);
        fixture.detectChanges();
      });

      it('should show default message if no message is provided', () => {
        const message = testHelper.queries.getTextContent('loading-message');
        expect(message).toBe('Loading...');
      });

      it('should show custom message if message is provided', () => {
        const customMessage = 'Please wait...';
        fixture.componentRef.setInput('message', customMessage);
        fixture.detectChanges();

        const message = testHelper.queries.getTextContent('loading-message');
        expect(message).toBe(customMessage);
      });
    });
  });

  describe('when loading ends', () => {
    let fixture: ReturnType<typeof setup>['fixture'];
    let testHelper: ReturnType<typeof setup>['testHelper'];

    beforeEach(() => {
      ({ fixture, testHelper } = setup());
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();
    });

    it('should not show loading bars', () => {
      const loadingBars = testHelper.queries.getTextContent('loading-bars');
      expect(loadingBars).toBeNull();
    });

    it('should not show message', () => {
      fixture.componentRef.setInput('showMessage', true);
      fixture.detectChanges();

      const message = testHelper.queries.query('loading-message');

      expect(message).toBeNull();
    });
  });
});
