import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Leads')
@Controller('quizzes')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post(':quizId/leads')
  @ApiOperation({ summary: 'Submit quiz responses (public endpoint)' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  create(@Param('quizId') quizId: string, @Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(quizId, createLeadDto);
  }

  @Get(':quizId/leads')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all leads for a quiz (authenticated)' })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  findAllByQuiz(@Param('quizId') quizId: string, @Request() req) {
    return this.leadsService.findAllByQuiz(quizId, req.user.sub);
  }

  @Get('project/:projectId/leads')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all leads for a project (authenticated)' })
  @ApiResponse({ status: 200, description: 'Leads retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findAllByProject(@Param('projectId') projectId: string, @Request() req) {
    return this.leadsService.findAllByProject(projectId, req.user.sub);
  }
} 