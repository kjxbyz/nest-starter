import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username, pass) {
    const user = this.usersService.findOne(username)
    if (user?.password !== pass) {
      throw new UnauthorizedException()
    }
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = this.usersService.findOne(username)
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }
}
