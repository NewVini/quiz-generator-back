import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Statistics')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('user')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved successfully' })
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