import { api } from 'encore.dev/api';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import applicationContext from '../applicationContext';

// Use Encore `api` calls to define the API routes instead of using NestJS controllers.
export const findAll = api(
  { expose: true, method: 'GET', path: '/cats' },
  async (): Promise<{ cats: Cat[] }> => {
    const { catsService } = await applicationContext;
    return { cats: await catsService.findAll() };
  },
);

export const get = api(
  { expose: true, method: 'GET', path: '/cats/:id' },
  async ({ id }: { id: number }): Promise<{ cat: Cat }> => {
    const { catsService } = await applicationContext;
    return { cat: await catsService.get(id) };
  },
);

// Endpoint requires authentication, auth handler will be called before the endpoint.
export const create = api(
  { expose: true, auth: true, method: 'POST', path: '/cats' },
  async (dto: CreateCatDto): Promise<void> => {
    // Inside the endpoint we can use the `applicationContext` to get the services we need.
    const { catsService } = await applicationContext;
    catsService.create(dto);
  },
);
