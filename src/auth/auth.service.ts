import { Injectable, UnauthorizedException, ConflictException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      password_hash: passwordHash,
      name,
      phone,
      role: 'owner' as any,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email, role: savedUser.role };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
      },
      token,
      message: 'Usuário registrado com sucesso. Crie uma subscription para acessar o sistema.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Se for admin, permite login sem subscription
    if (user.role === 'admin') {
      const payload = { sub: user.id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        subscription: null,
        token,
        message: 'Login de admin permitido sem necessidade de subscription.'
      };
    }

    // Check if user has active subscription
    const activeSubscription = await this.subscriptionsService.findActiveByUserId(user.id);
    
    if (!activeSubscription) {
      throw new ForbiddenException({
        message: 'Subscription required',
        code: 'SUBSCRIPTION_REQUIRED',
        details: {
          message: 'Você precisa de uma subscription ativa para acessar o sistema',
          availablePlans: await this.subscriptionsService.getAvailablePlans(),
          user_id: user.id
        }
      });
    }

    // Check if subscription is expired
    const currentDate = new Date();
    const endDate = new Date(activeSubscription.end_date);
    
    if (endDate < currentDate) {
      throw new ForbiddenException({
        message: 'Subscription expired',
        code: 'SUBSCRIPTION_EXPIRED',
        details: {
          message: 'Sua subscription expirou. Renove para continuar usando o sistema.',
          subscription: {
            id: activeSubscription.id,
            plan_type: activeSubscription.plan_type,
            end_date: activeSubscription.end_date,
            next_billing: activeSubscription.next_billing
          },
          user_id: user.id
        }
      });
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      subscription: {
        id: activeSubscription.id,
        plan_type: activeSubscription.plan_type,
        status: activeSubscription.status,
        end_date: activeSubscription.end_date,
        next_billing: activeSubscription.next_billing,
        quizzes_limit: activeSubscription.quizzes_limit,
        leads_limit: activeSubscription.leads_limit,
        quizzes_used: activeSubscription.quizzes_used,
        leads_used: activeSubscription.leads_used,
        price: activeSubscription.price
      },
      token,
    };
  }

  async generateTokenForUser(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
} 