import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashService: HashService,
  ) {}

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.findOneByEmail(createUserDto.email);
    if (user) throw new BadRequestException('El usuario ya existe');
    return this.userModel.create({
      ...createUserDto,
      password: await this.hashService.hash(createUserDto.password),
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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

  async getProfile(userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new NotFoundException();
    const { password, ...rest } = user.toObject(); // eslint-disable-line
    return rest;
  }
}
