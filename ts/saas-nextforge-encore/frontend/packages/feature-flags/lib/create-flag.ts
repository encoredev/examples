import { analytics } from '@repo/analytics/posthog/server';
import { getClient } from '@repo/client';
import { flag } from 'flags/next';

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const client = await getClient();

      const userId = '';
      if (!userId) {
        return this.defaultValue as boolean;
      }

      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
