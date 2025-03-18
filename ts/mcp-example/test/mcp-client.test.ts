import { describe, it, expect } from 'vitest';
import { api } from 'encore.dev/api';
import { health } from '../src/index';

describe('MCP API Tests', () => {
  it('should return a health check message', async () => {
    const response = await health();
    expect(response).toHaveProperty('message');
    expect(response.message).toContain('API Weather MCP Demo');
  });
});
