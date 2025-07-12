import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectSetting } from './entities/project-setting.entity/project-setting.entity';
import { ProjectSettingsController } from './project-settings.controller';
import { ProjectSettingsService } from './project-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectSetting])],
  controllers: [ProjectSettingsController],
  providers: [ProjectSettingsService]
})
export class ProjectSettingsModule {}
