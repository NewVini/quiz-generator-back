import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserInvitesService } from './user-invites.service';
import { InviteUserDto } from './dto/invite-user.dto';
import { AcceptInviteDto } from '../projects/dto/accept-invite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User Invites')
@Controller('user-invites')
export class UserInvitesController {
  constructor(private readonly userInvitesService: UserInvitesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invite user to become assistant' })
  @ApiResponse({ status: 201, description: 'User invited successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  inviteUser(@Body() inviteUserDto: InviteUserDto, @Request() req) {
    return this.userInvitesService.inviteUser(
      inviteUserDto.email, 
      req.user.sub, 
      inviteUserDto.default_permissions
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user invites sent by authenticated user' })
  @ApiResponse({ status: 200, description: 'User invites retrieved successfully' })
  getUserInvites(@Request() req) {
    return this.userInvitesService.getUserInvites(req.user.sub);
  }

  @Put(':inviteId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user invite' })
  @ApiResponse({ status: 200, description: 'Invite updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Invite not found' })
  updateInvite(
    @Param('inviteId') inviteId: string, 
    @Body() updateInviteDto: InviteUserDto, 
    @Request() req
  ) {
    return this.userInvitesService.updateInvite(
      inviteId, 
      req.user.sub, 
      updateInviteDto.email,
      updateInviteDto.default_permissions
    );
  }

  @Delete(':inviteId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel user invite' })
  @ApiResponse({ status: 200, description: 'Invite cancelled successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Invite not found' })
  cancelInvite(@Param('inviteId') inviteId: string, @Request() req) {
    return this.userInvitesService.cancelInvite(inviteId, req.user.sub);
  }

  // Endpoints sem autenticação para aceitar convites
  @Get(':token')
  @ApiOperation({ summary: 'Get user invite details by token' })
  @ApiResponse({ status: 200, description: 'Invite details retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Invalid or expired invite token' })
  getInviteByToken(@Param('token') token: string) {
    return this.userInvitesService.getInviteByToken(token);
  }

  @Post(':token/accept')
  @ApiOperation({ summary: 'Accept user invite' })
  @ApiResponse({ status: 201, description: 'Invite accepted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid invite or user already exists' })
  @ApiResponse({ status: 404, description: 'Invalid or expired invite token' })
  acceptInvite(
    @Param('token') token: string,
    @Body() acceptInviteDto: AcceptInviteDto,
  ) {
    return this.userInvitesService.acceptInvite(token, acceptInviteDto);
  }
} 