import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginCredentials } from './dto/login-credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { HashService } from 'src/hash/hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<any> {
    const newUser = await this.usersService.create(registerUserDto);
    const { password, ...result } = newUser.toObject(); // eslint-disable-line
    return result;
  }

  async login(loginCredentials: LoginCredentials) {
    const user = await this.usersService.findOneByEmail(loginCredentials.email);

    if (!user) throw new BadRequestException('El usuario no existe');

    const isValidPassword = await this.hashService.compare(
      loginCredentials.password,
      user.password,
    );

    if (!isValidPassword) throw new UnauthorizedException('Unauthorized');

    const payload = { sub: user._id.toString(), firstName: user.firstName };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
