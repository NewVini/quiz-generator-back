import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserInvite } from './entities/user-invite.entity';
import { UserPermission } from './entities/user-permission.entity';
import { UserInvitesService } from './user-invites.service';
import { UserPermissionsService } from './user-permissions.service';
import { UserInvitesController } from './user-invites.controller';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserInvite, UserPermission])],
  controllers: [UserInvitesController, UsersController],
  providers: [UsersService, UserInvitesService, UserPermissionsService],
  exports: [UsersService, UserInvitesService, UserPermissionsService],
})
export class UsersModule {}
