import { TestHelper } from '../test-helper/test-helper';

export function submitLoginForm(
  testHelper: TestHelper<unknown>,
  { email, password }: { email: string; password: string },
): void {
  testHelper.trigger.input('login-email', email);
  testHelper.trigger.input('login-password', password);
  testHelper.dispatch.submit('login-button');
}
