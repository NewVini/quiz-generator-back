import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ProjectPermissionsService } from './project-permissions.service';
import { ProjectInvitesService } from './project-invites.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddUserToProjectDto } from './dto/add-user-to-project.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectPermissionsService: ProjectPermissionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  findAll(@Request() req) {
    return this.projectsService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific project' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req) {
    return this.projectsService.update(id, updateProjectDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.sub);
  }

  @Post(':id/users')
  @ApiOperation({ summary: 'Add user to project' })
  @ApiResponse({ status: 201, description: 'User added to project successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project or user not found' })
  addUserToProject(
    @Param('id') projectId: string,
    @Body() addUserDto: AddUserToProjectDto,
    @Request() req,
  ) {
    return this.projectPermissionsService.addUserToProject(
      projectId,
      addUserDto.user_id,
      addUserDto.permissions,
      req.user.sub,
    );
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Get project users' })
  @ApiResponse({ status: 200, description: 'Project users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  getProjectUsers(@Param('id') projectId: string, @Request() req) {
    return this.projectPermissionsService.getProjectUsers(projectId, req.user.sub);
  }

  @Patch(':id/users/:userId')
  @ApiOperation({ summary: 'Update user permissions in project' })
  @ApiResponse({ status: 200, description: 'User permissions updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project or user not found' })
  updateUserPermissions(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Body() updatePermissionsDto: UpdateUserPermissionsDto,
    @Request() req,
  ) {
    return this.projectPermissionsService.updateUserPermissions(
      projectId,
      userId,
      updatePermissionsDto.permissions,
      req.user.sub,
    );
  }

  @Delete(':id/users/:userId')
  @ApiOperation({ summary: 'Remove user from project' })
  @ApiResponse({ status: 200, description: 'User removed from project successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Project or user not found' })
  removeUserFromProject(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    return this.projectPermissionsService.removeUserFromProject(
      projectId,
      userId,
      req.user.sub,
    );
  }

} 