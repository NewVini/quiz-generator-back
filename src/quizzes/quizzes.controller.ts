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
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Quizzes')
@Controller('projects/:projectId/quizzes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quiz' })
  @ApiResponse({ status: 201, description: 'Quiz created successfully' })
  create(
    @Param('projectId') projectId: string,
    @Body() createQuizDto: CreateQuizDto,
    @Request() req,
  ) {
    return this.quizzesService.create(createQuizDto, projectId, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quizzes for a project' })
  @ApiResponse({ status: 200, description: 'Quizzes retrieved successfully' })
  findAll(@Param('projectId') projectId: string, @Request() req) {
    return this.quizzesService.findAllByProject(projectId, req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific quiz' })
  @ApiResponse({ status: 200, description: 'Quiz retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.quizzesService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz updated successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @Request() req,
  ) {
    return this.quizzesService.update(id, updateQuizDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz deleted successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  remove(@Param('id') id: string, @Request() req) {
    return this.quizzesService.remove(id, req.user.sub);
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz published successfully' })
  publish(@Param('id') id: string, @Request() req) {
    return this.quizzesService.publish(id, req.user.sub);
  }

  @Post(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz unpublished successfully' })
  unpublish(@Param('id') id: string, @Request() req) {
    return this.quizzesService.unpublish(id, req.user.sub);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive a quiz' })
  @ApiResponse({ status: 200, description: 'Quiz archived successfully' })
  archive(@Param('id') id: string, @Request() req) {
    return this.quizzesService.archive(id, req.user.sub);
  }
} 