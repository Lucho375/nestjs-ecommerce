import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResetPasswordDto } from 'src/auth/dto';
import { HashService } from 'src/hash/hash.service';
import { CreateAdminUserDto, CreateUserDto, UpdateUserDto } from './dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashService: HashService,
  ) {}

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById({ _id: id });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  async findOne(filter: Partial<Record<keyof User, any>>) {
    return this.userModel.findOne(filter);
  }

  async create(createUserDto: CreateUserDto | CreateAdminUserDto) {
    delete createUserDto.confirmPassword;
    const user = await this.findOneByEmail(createUserDto.email);
    if (user) throw new BadRequestException('El usuario ya existe');
    return this.userModel.create({
      ...createUserDto,
      password: await this.hashService.hash(createUserDto.password),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto | ResetPasswordDto) {
    const userUpdated = updateUserDto.password
      ? {
          ...updateUserDto,
          password: await this.hashService.hash(updateUserDto.password),
        }
      : { ...updateUserDto };
    return this.userModel.findByIdAndUpdate(id, userUpdated, { new: true });
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async getProfile(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException();
    const { password, ...rest } = user.toObject(); // eslint-disable-line
    return rest;
  }

  async confirmUser(id: string) {
    const user = await this.update(id, { emailVerified: true });
    const { password, ...rest } = user.toObject(); // eslint-disable-line
    return rest;
  }
}
