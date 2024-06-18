import { Inject, Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';
import { CreateCatDto } from './dto/create-cat.dto';
import { Knex } from 'knex';

@Injectable()
export class CatsService {
  constructor(
    @Inject('CAT_MODEL') private readonly db: () => Knex.QueryBuilder<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<void> {
    await this.db().insert(createCatDto, '*');
    return;
  }

  async get(id: number): Promise<Cat> {
    return this.db().where('id', id).first();
  }

  async findAll(): Promise<Cat[]> {
    return await this.db().select();
  }
}
