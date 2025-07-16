import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, AuthProvider, UserRole } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

interface OAuthUserData {
  email: string;
  name: string;
  avatar_url?: string;
  provider_id: string;
  auth_provider: AuthProvider;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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
      role: UserRole.CREATOR,
      auth_provider: AuthProvider.LOCAL,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = { sub: savedUser.id, email: savedUser.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
        auth_provider: savedUser.auth_provider,
        avatar_url: savedUser.avatar_url,
      },
      token,
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

    // Check if user is using OAuth
    if (user.auth_provider !== AuthProvider.LOCAL) {
      throw new UnauthorizedException('Please login with your OAuth provider');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        auth_provider: user.auth_provider,
        avatar_url: user.avatar_url,
      },
      token,
    };
  }

  async findOrCreateOAuthUser(oauthData: OAuthUserData): Promise<User> {
    // Primeiro, tentar encontrar usuário pelo email
    let user = await this.userRepository.findOne({
      where: { email: oauthData.email },
    });

          if (user) {
        // Se o usuário existe mas não tem provider_id, atualizar
        if (!user.provider_id) {
          user.provider_id = oauthData.provider_id;
          user.auth_provider = oauthData.auth_provider;
          user.avatar_url = oauthData.avatar_url || null;
          await this.userRepository.save(user);
        }
        return user;
      }

    // Se não existe, criar novo usuário
    const newUser = this.userRepository.create({
      email: oauthData.email,
      name: oauthData.name,
      avatar_url: oauthData.avatar_url || null,
      provider_id: oauthData.provider_id,
      auth_provider: oauthData.auth_provider,
      role: UserRole.CREATOR,
    });

    return await this.userRepository.save(newUser);
  }

  async generateTokenForUser(user: User) {
    const payload = { sub: user.id, email: user.email };
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