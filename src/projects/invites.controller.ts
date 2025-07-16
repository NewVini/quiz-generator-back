import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectInvitesService } from './project-invites.service';
import { AcceptInviteDto } from './dto/accept-invite.dto';

@ApiTags('Invites')
@Controller('invites')
export class InvitesController {
  constructor(private readonly projectInvitesService: ProjectInvitesService) {}

  @Get(':token')
  @ApiOperation({ summary: 'Get invite details by token' })
  @ApiResponse({ status: 200, description: 'Invite details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invalid or expired invite token' })
  getInviteByToken(@Param('token') token: string) {
    return this.projectInvitesService.getInviteByToken(token);
  }

  @Post(':token/accept')
  @ApiOperation({ summary: 'Accept project invite' })
  @ApiResponse({ status: 201, description: 'Invite accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid invite or user already exists' })
  @ApiResponse({ status: 404, description: 'Invalid or expired invite token' })
  acceptInvite(
    @Param('token') token: string,
    @Body() acceptInviteDto: AcceptInviteDto,
  ) {
    return this.projectInvitesService.acceptInvite(token, acceptInviteDto);
  }
} 