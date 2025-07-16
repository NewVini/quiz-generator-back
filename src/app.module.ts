import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { UserPermission } from './users/entities/user-permission.entity';
import { Project } from './projects/entities/project.entity';
import { ProjectUser } from './projects/entities/project-user.entity';
import { ProjectInvite } from './projects/entities/project-invite.entity';
import { UserInvite } from './users/entities/user-invite.entity';
import { Quiz } from './quizzes/entities/quiz.entity';
import { Lead } from './leads/entities/lead.entity';
import { ProjectSettingsModule } from './project-settings/project-settings.module';
import { ProjectSetting } from './project-settings/entities/project-setting.entity/project-setting.entity';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Subscription } from './subscriptions/entities/subscription.entity';
import { BillingsModule } from './billings/billings.module';
import { Billing } from './billings/entities/billing.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        
        const config = {
          type: 'mysql' as const,
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT') || '3306'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [User, UserPermission, Project, ProjectUser, ProjectInvite, UserInvite, Quiz, Lead, ProjectSetting, Subscription, Billing],
          synchronize: false,
          logging: configService.get('NODE_ENV') === 'development',
          charset: 'utf8mb4',
          timezone: 'Z',
        };

        return config;
      },
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    QuizzesModule,
    LeadsModule,
    StatsModule,
    ProjectSettingsModule,
    SubscriptionsModule,
    BillingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
