import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectSetting } from './entities/project-setting.entity/project-setting.entity';
import { CreateProjectSettingDto } from './dto/create-project-setting.dto/create-project-setting.dto';
import { UpdateProjectSettingDto } from './dto/update-project-setting.dto/update-project-setting.dto';

@Injectable()
export class ProjectSettingsService {
  private readonly logger = new Logger(ProjectSettingsService.name);
  constructor(
    @InjectRepository(ProjectSetting)
    private readonly repo: Repository<ProjectSetting>,
  ) {}

  async create(dto: CreateProjectSettingDto): Promise<ProjectSetting> {
    this.logger.log('DTO recebido no service:', JSON.stringify(dto));
    const setting = this.repo.create(dto);
    this.logger.log('Entidade criada:', JSON.stringify(setting));
    return this.repo.save(setting);
  }

  async findAll(): Promise<ProjectSetting[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<ProjectSetting> {
    const setting = await this.repo.findOne({ where: { id } });
    if (!setting) throw new NotFoundException('ProjectSetting not found');
    return setting;
  }

  async update(id: string, dto: UpdateProjectSettingDto): Promise<ProjectSetting> {
    const setting = await this.findOne(id);
    Object.assign(setting, dto);
    return this.repo.save(setting);
  }

  async remove(id: string): Promise<void> {
    const setting = await this.findOne(id);
    await this.repo.remove(setting);
  }
}
