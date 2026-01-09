export function setAuthToken(): void {
  localStorage.setItem('auth_token', 'fake-jwt-token');
}
