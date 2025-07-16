import { SetMetadata } from '@nestjs/common';
import { ProjectPermission } from '../../users/entities/user.entity';

export const RequirePermission = (permission: ProjectPermission) =>
  SetMetadata('permission', permission); 