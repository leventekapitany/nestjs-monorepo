import { getAuthConfig } from '@/config/auth';
import { User } from '@/users/schemas/user.schema';
import { UsersService } from '@/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenPayloadDto } from '@shared/auth/dto/accesTokenPayloadDto';
import { createUserSchema } from '@shared/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createAccessToken(userId: string, username: string) {
    const payload: AccessTokenPayloadDto = {
      userId,
      username,
    };
    return this.jwtService.signAsync(payload, { expiresIn: '15m' });
  }

  async createRefreshToken(userId: string, passwordHash: string) {
    const refresh_token = await this.jwtService.signAsync(
      { id: userId },
      {
        expiresIn: '3d',
        // Sign with the password hash, so on password change, old tokens will be invalidated automatically
        secret: getAuthConfig(this.configService)?.jwtSecret + passwordHash,
      },
    );
    return refresh_token;
  }

  async decodeRefreshToken(refresh_token: string, passwordHash: string) {
    const payload = await this.jwtService.verifyAsync<{ id: string }>(
      refresh_token,
      {
        secret: getAuthConfig(this.configService)?.jwtSecret + passwordHash,
      },
    );
    return payload;
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOne(username);
    if (!user) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const refresh_token = await this.createRefreshToken(
      user._id.toString(),
      user.password,
    );
    const access_token = await this.createAccessToken(
      user._id.toString(),
      user.name,
    );

    return {
      refresh_token,
      access_token,
    };
  }

  async refresh(oldRefreshToken: string) {
    const userId = this.jwtService.decode(oldRefreshToken).id;
    if (!userId) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.usersService.getOne(userId);
    if (!user) throw new UnauthorizedException();

    try {
      await this.decodeRefreshToken(oldRefreshToken, user.password);
    } catch (err) {
      throw new UnauthorizedException();
    }
    const newAccessToken = await this.createAccessToken(userId, user.name);
    const newRefreshToken = await this.createRefreshToken(
      userId,
      user.password,
    );
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  // TODO: logout might be tricky, because jwt tokens cant be destroyed
  // Possible solutions: sign the token with the user password hash, so on password change, old tokens will be invalidated automatically
  // Or store the tokens in a blacklist until they are expired
  logOut() {
    throw new Error('Not implemented');
  }

  async createUser(username: string, password: string): Promise<User> {
    const userDto = createUserSchema.parse({
      username,
      password: await this.hash(password),
    });
    const user = await this.usersService.create(userDto);
    if (!user) throw new Error('Failed to create user');
    return user;
  }

  async getProfile(username: string) {
    const user = await this.usersService.findOne(username);
    if (!user) throw new Error('User not found');
    return {
      firstName: user.name,
      lastName: user.name,
      id: user._id.toString(),
    };
  }

  private async hash(text: string): Promise<string> {
    const appKey = getAuthConfig(this.configService)?.appKey;
    if (!appKey) throw new Error('Set the app key first!');
    const hash = await bcrypt.hash(text, appKey);
    return hash;
  }

  async generateAppKey() {
    return await bcrypt.genSalt();
  }
}
