import { TestHelper } from './test-helper';

export function submitLoginForm(
  testHelper: TestHelper<unknown>,
  { email, password }: { email: string; password: string },
): void {
  testHelper.triggerInputByTestId('login-email', email);
  testHelper.triggerInputByTestId('login-password', password);
  testHelper.dispatchSubmitEventByTestId('login-button');
}
