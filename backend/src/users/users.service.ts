import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createUserDto } from '@shared/users/dto/create-user.dto';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(username: string) {
    return this.userModel.findOne({ name: username }).exec();
  }
  async getOne(id: string) {
    return this.userModel.findById(id);
  }

  async create(createUserDto: createUserDto) {
    const user = await this.findOne(createUserDto.username);
    if (user) return user;
    const createdUser = new this.userModel<User>({
      name: createUserDto.username,
      password: createUserDto.password,
    });
    return createdUser.save();
  }

  // test this!!!
  async delete(id: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    return deletedUser;
  }
}
