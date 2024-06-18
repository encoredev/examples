import { Module } from '@nestjs/common';
import { CatsService } from './cats.service';
import { catsProviders } from './cats.providers';
import { DatabaseModule } from '../core/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [CatsService, ...catsProviders],
})
export class CatsModule {}
