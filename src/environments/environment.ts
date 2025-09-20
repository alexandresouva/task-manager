import { Environment } from './models/environment.model';

const BASE_URL = 'http://localhost:3000';

export const environment: Environment = {
  production: false,
  endpoints: {
    tasks: `${BASE_URL}/tasks`,
  },
};
