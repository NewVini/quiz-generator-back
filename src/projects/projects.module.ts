import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { ProjectUser } from './entities/project-user.entity';
import { ProjectInvite } from './entities/project-invite.entity';
import { ProjectPermissionsService } from './project-permissions.service';
import { ProjectInvitesService } from './project-invites.service';
import { InvitesController } from './invites.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectUser, ProjectInvite, User])],
  controllers: [ProjectsController, InvitesController],
  providers: [ProjectsService, ProjectPermissionsService, ProjectInvitesService],
  exports: [ProjectsService, ProjectPermissionsService, ProjectInvitesService],
})
export class ProjectsModule {}
