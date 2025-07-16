import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserPermissionsService } from './user-permissions.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserGlobalPermissionsDto } from './dto/update-user-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPermissionsService: UserPermissionsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users (creators and system admins only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  findAll(@Request() req, @Query('search') search?: string) {
    return this.usersService.findAll(req.user.sub, search);
  }

  @Get('assistants')
  @ApiOperation({ summary: 'List assistants created by the requesting user (creators and system admins only)' })
  @ApiResponse({ status: 200, description: 'Assistants retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  findAssistants(@Request() req, @Query('search') search?: string) {
    return this.usersService.findAssistantsByCreator(req.user.sub, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (creators can only view users they created, system admins can view anyone)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.usersService.findOne(id, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user (creators can only update users they created, system admins can update anyone)' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (creators can only delete users they created, system admins can delete anyone)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.usersService.remove(id, req.user.sub);
  }

  // Endpoints para gerenciar permissões
  @Get(':id/permissions')
  @ApiOperation({ summary: 'Get user permissions (creators can only view permissions for users they created, system admins can view anyone)' })
  @ApiResponse({ status: 200, description: 'User permissions retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserPermissions(@Param('id') id: string, @Request() req) {
    return this.userPermissionsService.getUserPermissions(id, req.user.sub);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Update user permissions (creators can only update permissions for users they created, system admins can update anyone)' })
  @ApiResponse({ status: 200, description: 'User permissions updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateUserPermissions(
    @Param('id') id: string, 
    @Body() updateUserPermissionsDto: UpdateUserGlobalPermissionsDto, 
    @Request() req
  ) {
    return this.userPermissionsService.updateUserPermissions(
      id, 
      updateUserPermissionsDto.permissions || [], 
      req.user.sub
    );
  }
} 