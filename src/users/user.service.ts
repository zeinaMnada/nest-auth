import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDTO } from './dto/create-user.dto';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return user;
    }
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    const newUser = new this.userModel(userData);
    await newUser.save();
    return this.userModel.findById(newUser._id);
  }
}
