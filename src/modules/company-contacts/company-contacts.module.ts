import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyContact } from './company-contact.entity';
import { CompanyContactsService } from './company-contacts.service';
import { CompanyContactsController } from './company-contacts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyContact])],
  controllers: [CompanyContactsController],
  providers: [CompanyContactsService],
})
export class CompanyContactsModule {}
