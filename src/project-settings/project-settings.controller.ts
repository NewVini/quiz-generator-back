import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectSettingsService } from './project-settings.service';
import { CreateProjectSettingDto } from './dto/create-project-setting.dto/create-project-setting.dto';
import { UpdateProjectSettingDto } from './dto/update-project-setting.dto/update-project-setting.dto';
import { ProjectSetting } from './entities/project-setting.entity/project-setting.entity';

@ApiTags('project-settings')
@Controller('project-settings')
export class ProjectSettingsController {
  constructor(private readonly service: ProjectSettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma configuração de projeto' })
  @ApiResponse({ status: 201, type: ProjectSetting })
  create(@Body() dto: CreateProjectSettingDto): Promise<ProjectSetting> {
    console.log('DTO recebido no controller:', dto);
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as configurações de projeto' })
  @ApiResponse({ status: 200, type: [ProjectSetting] })
  findAll(): Promise<ProjectSetting[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma configuração de projeto por ID' })
  @ApiResponse({ status: 200, type: ProjectSetting })
  findOne(@Param('id') id: string): Promise<ProjectSetting> {
    return this.service.findOne(id);
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Busca configuração de projeto por project_id (público)' })
  @ApiResponse({ status: 200, type: ProjectSetting, description: 'Configuração encontrada ou null' })
  async findByProjectId(@Param('projectId') projectId: string): Promise<ProjectSetting | null> {
    const all = await this.service.findAll();
    return all.find(cfg => cfg.project_id === projectId) || null;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma configuração de projeto' })
  @ApiResponse({ status: 200, type: ProjectSetting })
  update(@Param('id') id: string, @Body() dto: UpdateProjectSettingDto): Promise<ProjectSetting> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma configuração de projeto' })
  @ApiResponse({ status: 204 })
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
