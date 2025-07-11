import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { LeadsModule } from './leads/leads.module';
import { StatsModule } from './stats/stats.module';
import { User } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { Quiz } from './quizzes/entities/quiz.entity';
import { Lead } from './leads/entities/lead.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'quizzes',
      entities: [User, Project, Quiz, Lead],
      synchronize: false, // Desabilitar synchronize
      logging: false, // Desabilitar logs SQL
      charset: 'utf8mb4',
      timezone: 'Z',
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    QuizzesModule,
    LeadsModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
