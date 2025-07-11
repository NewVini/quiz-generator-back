import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { QuizzesModule } from '../quizzes/quizzes.module';
import { ProjectsModule } from '../projects/projects.module';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, Quiz, Project]), QuizzesModule, ProjectsModule],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
