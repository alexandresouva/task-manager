import { TestBed } from '@angular/core/testing';

import { TestHelper } from '@app/testing/helpers/test-helper';

import { CreateTask } from './create-task';

async function setup() {
  await TestBed.configureTestingModule({
    imports: [CreateTask],
  }).compileComponents();

  const fixture = TestBed.createComponent(CreateTask);
  const testHelper = new TestHelper(fixture);
  const component = fixture.componentInstance;
  fixture.detectChanges();

  return { fixture, component, testHelper };
}

describe.only('CreateTask', () => {
  const fakeTaskTitle = 'Test Task';

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  describe('when submitting the form', () => {
    it('should not emit created task if no description is entered', async () => {
      const { component, testHelper } = await setup();
      const emptyDescription = '';
      jest.spyOn(component.created, 'emit');

      component.form.controls.description.setValue(emptyDescription);
      testHelper.triggerFormSubmitByTestId(
        'create-task-form',
        emptyDescription,
      );

      expect(component.created.emit).not.toHaveBeenCalled();
    });

    it('should emit created task and reset the form if a valid description is entered', async () => {
      const { component, testHelper } = await setup();
      jest.spyOn(component.created, 'emit');

      component.form.setValue({ description: fakeTaskTitle });
      testHelper.triggerFormSubmitByTestId('create-task-form', fakeTaskTitle);

      expect(component.created.emit).toHaveBeenCalledWith(fakeTaskTitle);
      expect(component.form.value).toEqual({ description: '' });
    });
  });
});
