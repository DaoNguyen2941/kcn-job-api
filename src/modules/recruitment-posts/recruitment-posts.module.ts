import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentPost } from './recruitment-post.entity';
import { RecruitmentPostsService } from './recruitment-posts.service';
import { RecruitmentPostsController } from './recruitment-posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecruitmentPost])],
  controllers: [RecruitmentPostsController],
  providers: [RecruitmentPostsService],
})
export class RecruitmentPostsModule {}
