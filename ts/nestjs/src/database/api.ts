import { api } from 'encore.dev/api';

// We add an `api` call here in order for Encore to recognize the "database" folder
// as a service so that it can have its own migrations folder
export const db = api(
  { expose: false, method: 'POST' },
  async (): Promise<void> => {
    return;
  },
);
