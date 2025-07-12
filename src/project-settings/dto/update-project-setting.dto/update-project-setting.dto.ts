import { PartialType } from '@nestjs/swagger';
import { CreateProjectSettingDto } from '../create-project-setting.dto/create-project-setting.dto';

export class UpdateProjectSettingDto extends PartialType(CreateProjectSettingDto) {}
