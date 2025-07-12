import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Registra um novo usuário. Após o registro, o usuário precisará criar uma subscription para fazer login.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully - Usuário registrado, mas precisa de subscription para login',
    schema: {
      example: {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '+5511999999999',
          role: 'owner'
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        message: 'Usuário registrado com sucesso. Crie uma subscription para acessar o sistema.'
      }
    }
  })
  @ApiResponse({ 
    status: 409, 
    description: 'User already exists - Email já está em uso',
    schema: {
      example: {
        statusCode: 409,
        message: 'User with this email already exists',
        error: 'Conflict'
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Autentica o usuário e verifica se possui subscription ativa. Login é bloqueado para usuários sem plano ativo.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful - Usuário autenticado com subscription ativa',
    schema: {
      example: {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'João Silva',
          email: 'joao@example.com',
          phone: '+5511999999999',
          role: 'owner'
        },
        subscription: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          plan_type: 'monthly',
          status: 'active',
          end_date: '2024-02-01',
          next_billing: '2024-02-01',
          quizzes_limit: 1000,
          leads_limit: 100000,
          quizzes_used: 5,
          leads_used: 150,
          price: 29.90
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials - Email ou senha incorretos',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized'
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Subscription required - Usuário não possui subscription ativa',
    schema: {
      example: {
        statusCode: 403,
        message: 'Subscription required',
        code: 'SUBSCRIPTION_REQUIRED',
        details: {
          message: 'Você precisa de uma subscription ativa para acessar o sistema',
          availablePlans: {
            free: {
              quizzes_limit: 50,
              leads_limit: 10000,
              price: 0
            },
            monthly: {
              quizzes_limit: 1000,
              leads_limit: 100000,
              price: 29.90
            },
            yearly: {
              quizzes_limit: 1000,
              leads_limit: 100000,
              price: 299.90
            }
          },
          user_id: '123e4567-e89b-12d3-a456-426614174001'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Subscription expired - Subscription ativa mas expirada',
    schema: {
      example: {
        statusCode: 403,
        message: 'Subscription expired',
        code: 'SUBSCRIPTION_EXPIRED',
        details: {
          message: 'Sua subscription expirou. Renove para continuar usando o sistema.',
          subscription: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            plan_type: 'monthly',
            end_date: '2024-01-01',
            next_billing: '2024-02-01'
          },
          user_id: '123e4567-e89b-12d3-a456-426614174001'
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }



  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'User information retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    const user = await this.authService.validateUser(req.user.sub);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };
  }
} 