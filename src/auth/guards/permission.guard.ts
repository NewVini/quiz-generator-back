import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProjectPermissionsService } from '../../projects/project-permissions.service';
import { ProjectPermission } from '../../users/entities/user.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private projectPermissionsService: ProjectPermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<ProjectPermission>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.id || request.params.projectId;

    if (!user || !projectId) {
      throw new ForbiddenException('User or project not found');
    }

    try {
      await this.projectPermissionsService.checkUserPermission(
        projectId,
        user.sub,
        requiredPermission,
      );
      return true;
    } catch (error) {
      throw new ForbiddenException(`Insufficient permissions: ${requiredPermission}`);
    }
  }
} 