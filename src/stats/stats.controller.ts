import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

class LeadsPerDayDto {
  @ApiProperty({ example: '2024-06-01' })
  date: string;
  @ApiProperty({ example: 5 })
  total: number;
}

class UserStatsResponseDto {
  @ApiProperty({ example: 2 })
  total_projects: number;
  @ApiProperty({ example: 5 })
  total_quizzes: number;
  @ApiProperty({ example: 42 })
  total_leads: number;
  @ApiProperty({ type: [LeadsPerDayDto] })
  leads_per_day: LeadsPerDayDto[];
}

@ApiTags('Statistics')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('user')
  @ApiOperation({ summary: 'Get user statistics, including total leads per day' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully', type: UserStatsResponseDto })
  getUserStats(@Request() req) {
    return this.statsService.getUserStats(req.user.sub);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get project statistics' })
  @ApiResponse({ status: 200, description: 'Project statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  getProjectStats(@Param('projectId') projectId: string, @Request() req) {
    return this.statsService.getProjectStats(projectId, req.user.sub);
  }

  @Get('quizzes/:quizId')
  @ApiOperation({ summary: 'Get quiz statistics' })
  @ApiResponse({ status: 200, description: 'Quiz statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  getQuizStats(@Param('quizId') quizId: string, @Request() req) {
    return this.statsService.getQuizStats(quizId, req.user.sub);
  }
} 