import { Cat } from './interfaces/cat.interface';
import { Knex } from 'knex';

export const catsProviders = [
  {
    provide: 'CAT_MODEL',
    useFactory: (orm: Knex) => () => orm<Cat>('cats'),
    inject: ['DATABASE_CONNECTION'],
  },
];
